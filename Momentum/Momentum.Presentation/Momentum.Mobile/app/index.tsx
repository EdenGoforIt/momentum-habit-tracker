import { useIsAuthenticated } from "@/lib";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

interface IHomeProps {}

export default function Home() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  console.log('isAuthenticated :', isAuthenticated);
  
  useEffect(() => {
    setShouldRedirect(true);
  }, []);
  
  if (!shouldRedirect) {
    return null; // Prevent immediate redirect on mount
  }
  
  return (
    <>
      <Redirect href={isAuthenticated ? "/home" : "/welcome"} />
    </>
  );
}
