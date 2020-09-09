import Navbar from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/utils";
import { withUrqlClient } from "next-urql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  let postComponent =
    data && data.posts.map((x) => <div key={x.id}>{x.title}</div>);

  return (
    <>
      <Navbar></Navbar>
      {postComponent}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
