import { useAuth } from "../atoms/auth";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Comments from "../components/post/comments";
import CommentForm from "../components/post/comment-form";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { http } from "../http";
import { PostDetail } from "../api";

export async function postLoader({ params }: LoaderFunctionArgs) {
  const response = await http.blogDetail(Number.parseInt(params.id!));
  return response.data;
}

export default function Post() {
  const post = useLoaderData() as PostDetail;
  const { user } = useAuth();

  return (
    <>
      <h1 className="my-6 font-extrabold text-4xl sm:text-5xl lg:text-6xl text-center">
        {post.title}
      </h1>
      <h2 className="text-center">{post.author?.userName}</h2>
      <article className="prose max-w-none">
        <Markdown
          components={{
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={tomorrow}
                  PreTag={({ children }) => <>{children}</>}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </Markdown>
      </article>
      <div className="divider"></div>
      <Comments comments={post.comments ?? []} />
      <div className="divider"></div>
      {user ? <CommentForm postId={post.id!} /> : <></>}
    </>
  );
}
