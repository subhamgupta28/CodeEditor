import {RichTreeView, SimpleTreeView, TreeItem, useTreeViewApiRef} from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import {Box, Button, Stack} from "@mui/material";

function ProjectExplorer({ onFileSelect }) {
    const [files, setFiles] = useState([]);
    const apiRef = useTreeViewApiRef();
    const handleButtonClick = (event) => {
        apiRef.current?.focusItem(event, 'pickers');
    };
    useEffect(() => {
        axios.get("http://localhost:8011/api/code/list").then((res) => {
            setFiles(res.data);
        });
    }, []);

    const renderTree = (nodes) => {
        return nodes.map((file, index) => (
            <TreeItem
                key={index}
                nodeId={file.name}
                label={file.name}
                onClick={() => onFileSelect(file.name)}
             itemId={index}/>
        ));
    };

    return (
        // <SimpleTreeView>
        //     {renderTree(files)}
        // </SimpleTreeView>
        <Stack spacing={2}>
            {/*<div>*/}
            {/*    <Button onClick={handleButtonClick}>Focus pickers item</Button>*/}
            {/*</div>*/}
            <Box sx={{ minHeight: 352, minWidth: 250 }}>
                <RichTreeView
                    items={files}
                    apiRef={apiRef}
                    onItemClick={(event, itemId) => onFileSelect(itemId)}
                />
            </Box>
        </Stack>
        // <RichTreeView
        //     items={files}
        //     onItemClick={(event, itemId) => onFileSelect(itemId)}
        // />
    );
}

export default ProjectExplorer;
