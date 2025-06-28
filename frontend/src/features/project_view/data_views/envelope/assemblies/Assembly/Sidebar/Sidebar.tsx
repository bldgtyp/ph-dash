import { List, ListItem } from '@mui/material';

import { useAssemblyContext } from '../Assembly.Context';

import ChangeNameModal from '../../ChangeNameModal/Modal.ChangeName';
import AssemblyListHeader from './Sidebar.ListHeader';
import AssemblyListItemContent from './Sidebar.ListItemContent';

const AssemblySidebar: React.FC = () => {
    const assemblyContext = useAssemblyContext();

    // Create a sorted copy of the assemblies array
    const sortedAssemblies = [...assemblyContext.assemblies].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
            <ChangeNameModal />
            <AssemblyListHeader onAddAssembly={assemblyContext.handleAddAssembly} />
            <List dense>
                {sortedAssemblies.map(assembly => (
                    <ListItem key={assembly.id} component="div" disablePadding>
                        <AssemblyListItemContent
                            assembly={assembly}
                            isSelected={assemblyContext.selectedAssemblyId === assembly.id}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default AssemblySidebar;
