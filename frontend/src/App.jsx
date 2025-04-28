import EditorPage from "./components/EditorPage.jsx";
import {darkTheme} from "../Theme.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@mui/material";

function App() {

    return (
        <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
                <main>
                    <section>
                        <Routes>
                            <Route path="/" element={<EditorPage/>}/>
                        </Routes>
                    </section>


                </main>
            </BrowserRouter>

        </ThemeProvider>

    )
}

export default App
