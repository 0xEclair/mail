import './App.css';
import { Card, CssBaseline, GeistProvider, Grid, Image, Spacer, Tabs } from "@geist-ui/react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Signin } from "./pages/signin";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { useEffect, useState } from "react";
import { fetchData } from "./services";

export const Application = () => (
  <Provider store={store}>
    <BrowserRouter>
      <GeistProvider>
        <CssBaseline />
        <Switch>
          <Route exact path="/" component={Signin} />
          <Route path="/mail" component={Mail} />
        </Switch>
      </GeistProvider>
    </BrowserRouter>
  </Provider>
)

function Mail() {
  const [box, setBox] = useState({});
  const accountId = useSelector(state => state.account.accountId);
  useEffect(() => {
    fetchData(accountId).then((mails) => {
      setBox(mails);
    });
  },[]);
  return (
    <div className={"mail"}>
      <div className="mail-account">

      </div>
      <div className="mail-main">
        <div className="mail-main-tabs">
          <Tabs initialValue="1">
              <Tabs.Item label="inbox" value="1">
                <div className="inbox">
                  <Grid.Container gap={1.5} justify="flex-start">
                    {
                      (Object.keys(box).length === 0)?<div/>:
                        box.inbox.map((value, index) => {
                          console.log(value);
                          console.log(index);
                          return (
                            <Grid xs={8} key={index}>
                              <Card width="100%">
                                <h4>{value.subject}</h4>
                                <p>{value.body}</p>
                              </Card>
                              <Spacer />
                            </Grid>
                          );
                        })
                    }
                  </Grid.Container>
                </div>
              </Tabs.Item>
            <Tabs.Item label="sent" value="2">
              <div className="sent">
                <Grid.Container gap={1.5}>
                  {
                    (Object.keys(box).length === 0)?<div/>:
                      box.sent.map((value, index) => {
                        console.log(value);
                        console.log(index);
                        return (
                          <Grid xs={8} key={index}>
                            <Card width="100%">
                              <h4>{value.subject}</h4>
                              <p>{value.body}</p>
                            </Card>
                            <Spacer />
                          </Grid>
                        );
                      })
                  }
                </Grid.Container>
              </div>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
      <div className="mail-account">
        <div className="avatar">
          <Image
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%"
            }}
            src="https://img1.baidu.com/it/u=3467597502,1895566821&fm=26&fmt=auto" />
        </div>
      </div>
    </div>
  );
}

export default Application;


