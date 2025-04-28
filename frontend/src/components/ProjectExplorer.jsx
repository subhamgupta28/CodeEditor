import {RichTreeView, SimpleTreeView, TreeItem, useTreeViewApiRef} from "@mui/x-tree-view";
import { useEffect, useState } from "react";
import {Box, Button, Stack} from "@mui/material";
import {listFiles} from "../apis.jsx";

function ProjectExplorer({ onFileSelect }) {
    const [files, setFiles] = useState([]);
    const apiRef = useTreeViewApiRef();
    useEffect(() => {
        const fetch =  async () => {
            const res = await listFiles();
            setFiles(res);
        }
        fetch();
    }, []);


    return (
        <Stack spacing={2}>
            <Box sx={{ minHeight: 352, minWidth: 250 }}>
                <RichTreeView
                    items={files}
                    isItemEditable
                    apiRef={apiRef}
                    onItemClick={(event, itemId) => onFileSelect(itemId)}
                />
            </Box>
        </Stack>
    );
}

export default ProjectExplorer;
