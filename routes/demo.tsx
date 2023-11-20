import { PageProps } from "$fresh/server.ts";

import Counter from "../islands/Counter.tsx";

export const handler = {
  async GET(req, ctx) {
    console.log("demo");
    return ctx.render();
  },
};
export default function Demo(props: PageProps) {
  return (
    <>
      <div>
        <div>hello</div>
        <Counter></Counter>
      </div>
    </>
  );
}
