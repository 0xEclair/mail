import { Button, Input, Spacer } from "@geist-ui/react";
import { useDispatch } from "react-redux";
import { connectWallet } from "../store/actions";
import { useState } from "react";

export const Signin = (props) => {
  const [seed, setSeed] = useState("");
  const dispatch = useDispatch();
  const signin = async () => {
    if(await dispatch(connectWallet(seed)) === true) {
      props.history.push("/mail");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}>
      <h1>
        Solana Mail
      </h1>
      <Input
        placeholder="input your seed"
        value={seed}
        onChange={(e) => {
          setSeed(e.target.value);
        }}
      />
      <Spacer />
      <Button auto type="secondary" scale={1/3} onClick={signin}>
        log in
      </Button>
    </div>
  );
};