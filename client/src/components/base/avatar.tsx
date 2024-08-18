import { funEmoji } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";

export default function Avatar({ userName }: { userName?: string | null }) {
  const avatar = useMemo(
    () =>
      createAvatar(funEmoji, {
        size: 128,
        seed: userName ?? undefined,
      }).toDataUri(),
    [userName]
  );
  return <img className={userName ? "" : "opacity-25"} src={avatar} />;
}
