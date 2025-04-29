import {RichTreeView, useTreeViewApiRef} from "@mui/x-tree-view";
import { useEffect, useState } from "react";
import {Box, Button, Stack} from "@mui/material";
import {listFiles, createFile, deleteFile, renameFile} from "../apis.jsx";

function ProjectExplorer({ onFileSelect, onFileDelete, onFileRename }) {
    const [files, setFiles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const apiRef = useTreeViewApiRef();

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const res = await listFiles();
        setFiles(res);
    };

    const handleCreateFile = async () => {
        const filename = prompt("Enter new file path:");
        if (filename) {
            await createFile(filename);
            await fetchFiles();
        }
    };

    const handleDeleteFile = async () => {
        if (!selectedItem) {
            alert("No file selected!");
            return;
        }
        if (window.confirm(`Are you sure you want to delete "${selectedItem}"?`)) {
            await deleteFile(selectedItem);
            await fetchFiles();
            if (onFileDelete) onFileDelete(selectedItem);
        }
    };

    const handleRenameFile = async () => {
        if (!selectedItem) {
            alert("No file selected!");
            return;
        }
        const newName = prompt("Enter new name:", selectedItem);
        if (newName && newName !== selectedItem) {
            await renameFile(selectedItem, newName);
            await fetchFiles();
            if (onFileRename) onFileRename(selectedItem, newName);
        }
    };

    return (
        <Box style={{ height: '100dvh', overflow: 'scroll' }}>
            <Stack spacing={1} m={1}>
                <Button size="small" variant="contained" onClick={handleCreateFile}>New File</Button>
                <Button size="small" variant="outlined" onClick={handleRenameFile}>Rename</Button>
                <Button size="small" variant="outlined" color="error" onClick={handleDeleteFile}>Delete</Button>
            </Stack>
            <RichTreeView
                items={files}
                style={{ margin: '20px' }}
                isItemEditable
                apiRef={apiRef}
                onItemClick={(event, itemId) => {
                    setSelectedItem(itemId);
                    onFileSelect(itemId);
                }}
            />
        </Box>
    );
}

export default ProjectExplorer;
