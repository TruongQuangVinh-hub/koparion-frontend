import { useEffect, useState } from "react";
import {
  fetchCategoriesAPI,
  fetchProductsAdminAPI
} from "../../../api/backendAPI";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "📚 Xin chào! Tôi chỉ hỗ trợ tìm sách, giá và thể loại sách."
    }
  ]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          fetchProductsAdminAPI(),
          fetchCategoriesAPI()
        ]);
        setProducts(p || []);
        setCategories(c || []);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  // ================= UTIL =================
  const formatPrice = (n) =>
    Number(n).toLocaleString("vi-VN") + "đ";

  const normalize = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // ================= INTENT CHECK =================
  const isBookDomain = (text) => {
    const t = normalize(text);
    return (
      t.includes("sach") ||
      t.includes("book") ||
      t.includes("gia") ||
      t.includes("loai") ||
      t.includes("the loai") ||
      t.includes("manga") ||
      t.includes("van hoc") ||
      t.includes("truyen")
    );
  };

  // ================= FIND CATEGORY =================
  const findCategory = (text) => {
    const t = normalize(text);

    const map = [
      { id: 8, keys: ["lich su", "triet hoc"] },
      { id: 1, keys: ["van hoc", "tieu thuyet"] },
      { id: 2, keys: ["kinh doanh", "dau tu"] },
      { id: 3, keys: ["ky nang"] },
      { id: 4, keys: ["giao khoa", "toan"] },
      { id: 5, keys: ["ngoai ngu"] },
      { id: 6, keys: ["manga", "truyen tranh"] },
      { id: 7, keys: ["cong nghe", "khoa hoc"] },
      { id: 9, keys: ["trinh tham", "kinh di"] },
      { id: 10, keys: ["thieu nhi"] }
    ];

    const found = map.find((m) =>
      m.keys.some((k) => t.includes(k))
    );

    if (found) {
      return categories.find((c) => c.id === found.id);
    }

    return categories.find((c) =>
      normalize(c.name).includes(t)
    );
  };

  // ================= FIND PRODUCTS =================
  const findProducts = (text) => {
    const t = normalize(text);

    return products
      .map((p) => {
        const name = normalize(p.name);
        const cat = normalize(p.category?.name || "");

        let score = 0;
        if (name.includes(t)) score += 5;
        if (cat.includes(t)) score += 3;

        t.split(" ").forEach((w) => {
          if (w.length > 2 && name.includes(w)) score += 2;
        });

        return { ...p, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  };

  // ================= PRICE SEARCH =================
  const findByPrice = (text) => {
    const nums = text.match(/\d+/g);
    if (!nums) return [];

    const price = Number(nums[0]);

    return products
      .map((p) => ({
        ...p,
        diff: Math.abs(p.price - price)
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 6);
  };

  // ================= AI (LOCAL PROMPT ENGINE) =================
  const generateReply = async (userText) => {
    const text = userText;

    if (!isBookDomain(text)) {
      return "📚 Tôi chỉ hỗ trợ tìm sách, giá và thể loại sách thôi nhé.";
    }

    // 1. tìm theo tên sách
    const bestProducts = findProducts(text);
    if (bestProducts.length && !text.includes("gia")) {
      return `📖 Kết quả sách:

${bestProducts
          .map(
            (p) =>
              `• ${p.name} - ${formatPrice(p.price)} (${p.category?.name})`
          )
          .join("\n")}`;
    }

    // 2. tìm theo giá
    if (text.includes("gia") || text.includes("bao nhieu")) {
      const priceList = findByPrice(text);

      return `💰 Sách gần mức giá:

${priceList
          .map(
            (p) =>
              `• ${p.name} - ${formatPrice(p.price)}`
          )
          .join("\n")}`;
    }

    // 3. theo thể loại
    const cat = findCategory(text);
    if (cat) {
      const list = products.filter(
        (p) => p.category?.id === cat.id
      );

      return `📚 ${cat.name}:

${list
          .slice(0, 8)
          .map(
            (p) =>
              `• ${p.name} - ${formatPrice(p.price)}`
          )
          .join("\n")}`;
    }

    // 4. fallback AI-like gợi ý
    return `📚 Bạn có thể hỏi:

• tên sách (ví dụ: Doraemon)
• thể loại (lịch sử, manga...)
• giá (ví dụ: 100000)

Hoặc tôi có thể gợi ý sách cho bạn.`;
  };

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const current = input;
    setInput("");
    setLoading(true);

    setTimeout(async () => {
      const reply = await generateReply(current);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply }
      ]);

      setLoading(false);
    }, 300);
  };

  // ================= UI =================
  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg,#ff6b00,#ff9248)",
          color: "#fff",
          fontSize: 22,
          zIndex: 999,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
      >
        💬
      </button>

      {/* CHAT BOX */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 380,
            height: 560,
            display: "flex",
            flexDirection: "column",
            background: "#fff3eb",
            borderRadius: 16,
            overflow: "hidden",
            zIndex: 999
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: 12,
              background: "linear-gradient(135deg,#ff6b00,#ff9248)",
              color: "#fff",
              fontWeight: "bold"
            }}
          >
            📚 AI Book Assistant
          </div>

          {/* MESSAGES */}
          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    m.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: 8
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: 10,
                    borderRadius: 10,
                    fontSize: 13,
                    whiteSpace: "pre-line",
                    background:
                      m.sender === "user"
                        ? "#ff6b00"
                        : "#fff",
                    color:
                      m.sender === "user" ? "#fff" : "#333"
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ fontSize: 12, color: "#888" }}>
                ⏳ AI đang xử lý...
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              padding: 10,
              borderTop: "1px solid #ffd2b3",
              background: "#fff"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              placeholder="Hỏi về sách..."
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "1px solid #ffd2b3"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: 6,
                background:
                  "linear-gradient(135deg,#ff6b00,#ff9248)",
                color: "#fff",
                border: "none",
                padding: "0 14px",
                borderRadius: 10
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}