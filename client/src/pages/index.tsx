import { http } from "../http";
import WelcomeHero from "../components/base/welcome-hero";
import { Post } from "../api";
import PostPreview from "../components/post/post-preview";
import { useLoaderData } from "react-router-dom";

export async function indexLoader() {
  const response = await http.blogList();
  return response.data;
}

export default function Index() {
  const posts = useLoaderData() as Post[];

  return (
    <>
      <WelcomeHero />
      <div className="divider"></div>
      {posts ? (
        posts.map((post) => <PostPreview key={post.id} post={post} />)
      ) : (
        <p>No posts found</p>
      )}
    </>
  );
}
