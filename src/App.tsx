import React from 'react'
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AnalysisView } from './features/analysisview/view';

const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function App() {
  const { mode, setMode } = useColorScheme();
  if (mode == null) {
    setMode("light")
    return <></>;
  }
  return (
    <Box width="100vw" minHeight="100vh" sx={{ display: 'flex', flexFlow: 'column', backgroundColor: "#e3f2ff" }}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AnalysisView />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

function ThemedApp() {
  return <ThemeProvider theme={darkTheme}><App /></ThemeProvider>
}

export default ThemedApp;