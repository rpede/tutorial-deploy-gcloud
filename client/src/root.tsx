import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/base/layout";

export default function Root() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}
