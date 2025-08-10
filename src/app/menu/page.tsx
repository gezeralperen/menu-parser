"use client";
import { MenuView } from "@/components/MenuView";
import { useMenu } from "@/context/MenuContext";

export default function MenuPage() {
  const { menu } = useMenu();

  if (!menu) {
    return (
      <main className="container">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main>
      <MenuView menu={menu} />
    </main>
  );
}
