import Navbar from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/utils";
import { withUrqlClient } from "next-urql";
import BaseLayout from "../components/BaseLayout";
import { PostWrapper } from "../components/PostWrapper";

const Index = () => {
  const [{ data }] = usePostsQuery();

  let postComponent = data && (
    <PostWrapper column={1} spacing={10} posts={data.posts as any} />
  );

  return <BaseLayout variant="regular">{postComponent}</BaseLayout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
