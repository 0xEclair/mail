import './App.css';
import { CssBaseline, Divider, GeistProvider } from "@geist-ui/react";

export const Application = () => (
  <GeistProvider>
    <CssBaseline />
    <App />
  </GeistProvider>
)

function App() {
  return (
    <div className={"App"}>
      <div className={"drawer"}>
        <div className={"drawer-toolbar"}>
          drawer-toolbar
        </div>
        <div className={"drawer-main"}>
          <Divider h={1} style={{backgroundColor: "#424242"}} />
          <div>Inbox</div>
          <Divider h={2} style={{backgroundColor: "#424242"}} />
          <div>Sent</div>
          <Divider style={{backgroundColor: "#212121"}} />
          <div>Logout</div>
        </div>
      </div>
      <div className={"page"}>
        <div className={"page-toolbar"}>
          page-toolbar
        </div>
        <div className={"page-main"}>page-main</div>
      </div>
    </div>
  );
}

export default Application;
