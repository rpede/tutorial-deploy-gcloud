import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Root from "./root";
import Index, { indexLoader } from "./pages";
import ErrorPage from "./pages/error-page";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import RegisterSuccess from "./pages/auth/register-success";
import DraftList, { draftsLoader } from "./pages/drafts/list";
import DraftCreate from "./pages/drafts/create";
import DraftUpdate, { draftLoader } from "./pages/drafts/update";
import Post, { postLoader } from "./pages/post";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route index={true} element={<Index />} loader={indexLoader} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/post">
        <Route path=":id" element={<Post />} loader={postLoader}></Route>
      </Route>
      <Route path="/draft">
        <Route path="" element={<DraftList />} loader={draftsLoader}></Route>
        <Route path="create" element={<DraftCreate />}></Route>
        <Route
          path=":id"
          element={<DraftUpdate />}
          loader={draftLoader}
        ></Route>
      </Route>
    </Route>,
  ),
);

export default router;
