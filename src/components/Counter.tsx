import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            style={{
                padding: "0.5em 1.25em",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "0.5rem",
                border: "2px solid oklch(0.55 0.2 260)",
                background: "oklch(0.55 0.2 260 / 0.1)",
                color: "oklch(0.55 0.2 260)",
                cursor: "pointer",
                transition: "all 0.2s",
            }}
        >
            Count: {count}
        </button>
    );
}
