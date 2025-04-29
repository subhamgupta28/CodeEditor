import {Grid, Button, Stack, Divider, Tabs, Tab, Box, IconButton, Typography} from "@mui/material";
import CodeEditor from "../components/CodeEditor";
import ProjectExplorer from "../components/ProjectExplorer";
import { useState } from "react";
import { buildCode, getFileOpen, saveCode, uploadCode } from "../apis.jsx";
import CloseIcon from '@mui/icons-material/Close';

function EditorPage() {
    const [openFiles, setOpenFiles] = useState([]); // [{ filename, content }]
    const [currentTab, setCurrentTab] = useState(0);

    const saveCodeHandle = async () => {
        if (openFiles.length === 0) return alert("No file selected!");
        const { filename, content } = openFiles[currentTab];
        await saveCode(content, filename);
        alert("File saved!");
    };

    const buildCodeHandle = async () => {
        const res = await buildCode();
        alert(`Build finished with exit code ${res.data.exitCode}`);
    };

    const uploadCodeHandle = async () => {
        const res = await uploadCode();
        alert(`Upload finished with exit code ${res.data.exitCode}`);
    };

    const handleFileOpen = async (filename) => {
        const existingIndex = openFiles.findIndex(f => f.filename === filename);
        if (existingIndex !== -1) {
            setCurrentTab(existingIndex);
        } else {
            const res = await getFileOpen(filename);
            setOpenFiles(prev => [...prev, { filename, content: res.content }]);
            setCurrentTab(openFiles.length); // new file at the end
        }
    };

    const handleEditorChange = (value) => {
        setOpenFiles(prev => {
            const updated = [...prev];
            updated[currentTab].content = value;
            return updated;
        });
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleTabClose = (event, index) => {
        event.stopPropagation(); // prevent tab switching
        setOpenFiles(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
        });

        if (currentTab >= index) {
            setCurrentTab(prev => Math.max(0, prev - 1));
        }
    };

    return (
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            <div style={{ width: '20%' }}>
                <ProjectExplorer
                    onFileSelect={handleFileOpen}
                    onFileDelete={(deletedFile) => {
                        setOpenFiles(prev => prev.filter(f => f.filename !== deletedFile));
                    }}
                    onFileRename={(oldName, newName) => {
                        setOpenFiles(prev => prev.map(f => {
                            if (f.filename === oldName) {
                                return { ...f, filename: newName };
                            }
                            return f;
                        }));
                    }}
                />

            </div>
            <div style={{ width: '80%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs size="small" value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                        {openFiles.map((file, index) => (
                            <Tab
                                key={file.filename}
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" component="body1" sx={{ textTransform: 'none' }}>
                                            {file.filename.split('/').pop()}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={(event) => handleTabClose(event, index)}
                                            sx={{ ml: 1 }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                }
                            />
                        ))}
                    </Tabs>
                </Box>
                <Box flexGrow={1} overflow="auto">
                    {openFiles.length > 0 && (
                        <CodeEditor
                            value={openFiles[currentTab]?.content || ''}
                            extension={openFiles[currentTab]?.extension || ''}
                            onChange={handleEditorChange}
                        />
                    )}
                </Box>
                <Stack direction="row" spacing={2} p={1}>
                    <Button size="small" variant="contained" onClick={saveCodeHandle}>Save</Button>
                    <Button size="small" variant="contained" onClick={buildCodeHandle}>Build</Button>
                    <Button size="small" variant="contained" onClick={uploadCodeHandle}>Upload</Button>
                </Stack>
            </div>
        </Stack>
    );
}

export default EditorPage;
