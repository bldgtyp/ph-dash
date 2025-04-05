import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";

type propsType = {
    projectId: string;
    activeTab: number; // The active tab index managed by the parent
    onTabChange: (newTab: number) => void; // Callback function to notify parent of tab changes
}

const ProjectTabBar: React.FC<propsType> = ({ projectId, activeTab, onTabChange }) => {
    const tabs = [
        { label: "Certification", path: `/projects/${projectId}/certification` },
        { label: "Windows", path: `/projects/${projectId}/window_data` },
        { label: "Assemblies", path: `/projects/${projectId}/assembly_data` },
        { label: "Equipment", path: `/projects/${projectId}/equipment_data` },
        { label: "Model", path: `/projects/${projectId}/model` },
    ];

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        onTabChange(newValue); // Notify the parent component of the tab change
    };

    return (
        <Box id="project-tab-bar" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={activeTab} // The active tab is managed by the parent
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>
        </Box>
    );
}

export default ProjectTabBar;