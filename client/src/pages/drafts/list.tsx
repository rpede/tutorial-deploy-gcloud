import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { http } from "../../http";
import { Draft } from "../../api";

export async function draftsLoader() {
  const response = await http.draftList();
  return response.data;
}

export default function DraftList() {
  const drafts = useLoaderData() as Draft[];
  const revalidator = useRevalidator();

  async function deleteDraft(id: number) {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      await http.draftDelete(id);
      revalidator.revalidate();
    }
  }

  return (
    <>
      <div className="prose max-w-none">
        <h1 className="text-center">Drafts</h1>
      </div>
      <Link to="create" className="btn btn-primary">
        Create
      </Link>
      <div className="overflow-x-auto">
        <table className="table w-100">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th className="w-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft) => (
              <tr key={draft.id}>
                <td>{draft.id}</td>
                <td>{draft.title}</td>
                <td>{draft.author?.userName}</td>
                <td>
                  <div className="join join-vertical lg:join-horizontal">
                    <Link
                      to={`${draft.id}`}
                      className="btn btn-info join-item "
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteDraft(draft.id!)}
                      className="btn btn-error join-item"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
