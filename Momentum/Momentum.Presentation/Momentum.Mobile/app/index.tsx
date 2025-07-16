import { Redirect } from "expo-router";
import React from "react";

interface IHomeProps {}

export default function Home() {
  return (
    <>
      <Redirect href="/home" />
    </>
  );
}
