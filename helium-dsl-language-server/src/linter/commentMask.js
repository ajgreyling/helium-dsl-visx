/**
 * Replaces line comments (slash-slash) and block comments (slash-star … star-slash)
 * with spaces, preserving length and newlines for stable linter column offsets.
 * Skips regions inside quotes and inside multiline string markers (slash-percent … percent-slash).
 */
export function maskCommentsPreserveLength(text) {
    const n = text.length;
    const out = new Array(n);
    for (let i = 0; i < n; i++) {
        out[i] = text[i];
    }
    let state = "code";
    let escapeNext = false;
    let i = 0;
    while (i < n) {
        const c = text[i];
        const next = i + 1 < n ? text[i + 1] : "";
        if (state === "line_comment") {
            if (c === "\r") {
                out[i] = "\r";
                if (next === "\n") {
                    out[i + 1] = "\n";
                    i += 2;
                }
                else {
                    i++;
                }
                state = "code";
                continue;
            }
            if (c === "\n") {
                out[i] = "\n";
                i++;
                state = "code";
                continue;
            }
            out[i] = " ";
            i++;
            continue;
        }
        if (state === "block_comment") {
            if (c === "*" && next === "/") {
                out[i] = " ";
                out[i + 1] = " ";
                i += 2;
                state = "code";
                continue;
            }
            if (c === "\r" || c === "\n") {
                out[i] = c;
                if (c === "\r" && next === "\n") {
                    out[i + 1] = "\n";
                    i += 2;
                }
                else {
                    i++;
                }
                continue;
            }
            out[i] = " ";
            i++;
            continue;
        }
        if (state === "dbl_string") {
            if (escapeNext) {
                escapeNext = false;
                i++;
                continue;
            }
            if (c === "\\") {
                escapeNext = true;
                i++;
                continue;
            }
            if (c === '"') {
                state = "code";
            }
            i++;
            continue;
        }
        if (state === "sgl_string") {
            if (escapeNext) {
                escapeNext = false;
                i++;
                continue;
            }
            if (c === "\\") {
                escapeNext = true;
                i++;
                continue;
            }
            if (c === "'") {
                state = "code";
            }
            i++;
            continue;
        }
        if (state === "multiline_str") {
            if (c === "%" && next === "/") {
                i += 2;
                state = "code";
                continue;
            }
            if (c === "\r" || c === "\n") {
                out[i] = c;
                if (c === "\r" && next === "\n") {
                    out[i + 1] = "\n";
                    i += 2;
                }
                else {
                    i++;
                }
                continue;
            }
            i++;
            continue;
        }
        if (c === "/" && next === "/") {
            out[i] = " ";
            out[i + 1] = " ";
            i += 2;
            state = "line_comment";
            continue;
        }
        if (c === "/" && next === "*") {
            out[i] = " ";
            out[i + 1] = " ";
            i += 2;
            state = "block_comment";
            continue;
        }
        if (c === "/" && next === "%") {
            i += 2;
            state = "multiline_str";
            continue;
        }
        if (c === '"') {
            state = "dbl_string";
            i++;
            continue;
        }
        if (c === "'") {
            state = "sgl_string";
            i++;
            continue;
        }
        i++;
    }
    return out.join("");
}
