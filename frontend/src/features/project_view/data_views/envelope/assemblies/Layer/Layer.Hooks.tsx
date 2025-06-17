import { useState } from 'react';
import { LayerType } from '../../_types/Layer';
import { SegmentType, SpecificationStatus } from '../../_types/Segment';
import { postWithAlert } from '../../../../../../api/postWithAlert';
import { deleteWithAlert } from '../../../../../../api/deleteWithAlert';
import { patchWithAlert } from '../../../../../../api/patchWithAlert';
import { UpdatableInput } from '../../../../../types/UpdatableInput';

export const useLayerHooks = (layer: LayerType) => {
    // Basic State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLayerHovered, setIsLayerHovered] = useState(false);
    const [segments, setSegments] = useState(layer.segments);

    // Layer Thickness
    const [currentLayerThicknessMM, setCurrentLayerThicknessMM] = useState(layer.thickness_mm);
    const [layerThicknessUserInputMM, setLayerThicknessUserInputMM] = useState(layer.thickness_mm);
    const layerThickness = new UpdatableInput<number, { thickness_mm: number }>(
        currentLayerThicknessMM,
        setCurrentLayerThicknessMM,
        layerThicknessUserInputMM,
        (args: { thickness_mm: number }) => {
            setLayerThicknessUserInputMM(args.thickness_mm);
        }
    );

    const handleSubmitChangeLayerThickness = async (layer: LayerType) => {
        try {
            if (layerThickness.hasChanged()) {
                const response = await patchWithAlert<LayerType>(`assembly/update-layer-thickness/${layer.id}`, null, {
                    thickness_mm: layerThickness.newValue,
                });

                if (response) {
                    layerThickness.setCurrentValue(response.thickness_mm);
                } else {
                    console.error(`Failed to update layer-thickness to: '${layerThickness.newValue}'`);
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update layer:', error);
            setIsModalOpen(false);
        }
    };

    // Mouse Event Handlers
    const handleMouseEnter = () => setIsLayerHovered(true);
    const handleMouseLeave = () => setIsLayerHovered(false);
    const handleMouseClick = () => setIsModalOpen(true);
    const handleModalClose = () => {
        setLayerThicknessUserInputMM(currentLayerThicknessMM);
        setIsModalOpen(false);
    };

    const handleAddSegmentToRight = async (segment: SegmentType, layer: LayerType) => {
        const DEFAULT_WIDTH = 50;

        try {
            // New Segment goes to the right of the current segment
            const orderPosition = segment.order + 1;

            // Call the backend API to add the new segment
            const response = await postWithAlert<SegmentType>(
                `assembly/create-new-segment-on-layer/${layer.id}`,
                null,
                {
                    material_id: segment.material.id, // Match the material ID from the segment
                    width_mm: DEFAULT_WIDTH,
                    order: orderPosition,
                }
            );

            if (response) {
                // Add the new segment to the local state
                const newSegment: SegmentType = {
                    id: response.id,
                    layer_id: response.layer_id,
                    material_id: response.material.id,
                    material: response.material,
                    width_mm: response.width_mm,
                    order: response.order,
                    steel_stud_spacing_mm: null,
                    is_continuous_insulation: false,
                    specification_status: SpecificationStatus.NA,
                    material_photos: [],
                    material_datasheets: [],
                    notes: null,
                };

                // Update the segments array to reflect the insertion
                const updatedSegments = [...segments];
                updatedSegments.splice(orderPosition, 0, newSegment); // Insert the new segment
                updatedSegments.forEach((segment, index) => {
                    segment.order = index; // Recalculate the order for all segments
                });

                setSegments(updatedSegments);
            }
        } catch (error) {
            console.error('Failed to add segment:', error);
        }
    };

    const handleDeleteSegment = async (segmentId: number) => {
        try {
            // Call the backend API to delete the segment
            const response = await deleteWithAlert<{ message: string }>(`assembly/delete-segment/${segmentId}`, null);

            if (response) {
                // Remove the segment from the local state
                const updatedSegments = segments.filter(segment => segment.id !== segmentId);

                // Recalculate the order for the remaining segments
                updatedSegments.forEach((segment, index) => {
                    segment.order = index;
                });

                setSegments(updatedSegments);
            }
        } catch (error) {
            console.error('Failed to delete segment:', error);
        }
    };

    return {
        isModalOpen: isModalOpen,
        setIsModalOpen: setIsModalOpen,
        isLayerHovered: isLayerHovered,
        setIsLayerHovered: setIsLayerHovered,
        segments: segments,
        setSegments: setSegments,
        handleMouseEnter: handleMouseEnter,
        handleMouseLeave: handleMouseLeave,
        handleMouseClick: handleMouseClick,
        handleModalClose: handleModalClose,
        handleAddSegmentToRight: handleAddSegmentToRight,
        handleDeleteSegment: handleDeleteSegment,
        handleSubmitChangeLayerThickness: handleSubmitChangeLayerThickness,
        layerThickness: layerThickness,
    };
};
