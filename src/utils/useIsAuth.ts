import { useRouter } from "next/router";
import { useEffect } from "react";
import { REDIRECT_TO } from "../Constants";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      // no auth user
      router.replace(`/login?${REDIRECT_TO}=${router.pathname}`);
    }
  }, [data, router]);
};
