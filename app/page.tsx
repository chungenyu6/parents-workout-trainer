"use client";

import { useMemo, useState } from "react";

type PersonId = "dad" | "mom";
type ViewId = "today" | "records" | "progress" | "learn";

type ConceptCard = {
  title: string;
  body: string;
  source: string;
  url: string;
  tag: string;
};

const people: Record<PersonId, { label: string; greeting: string; framing: string }> = {
  dad: {
    label: "爸爸",
    greeting: "今天補一點身體的底盤",
    framing: "保留原有活動的底氣，也把肌力與平衡補起來。",
  },
  mom: {
    label: "媽媽",
    greeting: "今天做一點，就很值得",
    framing: "先讓身體習慣規律出現，不追求累，也不追求完美。",
  },
};

const exercises = [
  {
    number: "01",
    name: "椅子坐站",
    functionName: "從椅子站起來更穩",
    reps: "5–8 下",
    steps: ["找一張不會滑動的穩固椅子", "雙腳踩穩，身體微微向前", "慢慢站起，再慢慢坐下"],
    observe: "留意膝蓋疼痛、身體搖晃、憋氣或需要用手撐。",
  },
  {
    number: "02",
    name: "扶牆踮腳",
    functionName: "走路與站穩的底氣",
    reps: "8–12 下",
    steps: ["雙手扶牆或穩固桌面", "腳跟慢慢抬起", "停一下，再慢慢放下"],
    observe: "留意抽筋、腳踝搖晃或左右差異很大。",
  },
  {
    number: "03",
    name: "空手划船",
    functionName: "背挺一點，肩膀更自在",
    reps: "8–12 下",
    steps: ["坐姿或站姿都可以，手肘彎曲放在身體兩側", "手肘慢慢往後帶，肩胛骨輕輕靠近", "肩膀不要聳起，再慢慢回來"],
    observe: "目前先不用彈力帶。留意肩膀疼痛、聳肩或憋氣。",
  },
  {
    number: "04",
    name: "扶桌髖鉸鏈",
    functionName: "彎腰拿東西更安心",
    reps: "5–8 下",
    steps: ["雙手扶穩固桌面，膝蓋微彎", "屁股慢慢往後推", "身體微微前傾，再回來"],
    observe: "留意腰部不舒服、背部過度拱起或失去平衡。",
  },
];

const conceptCards: ConceptCard[] = [
  {
    title: "肌力是生活能力，不只是外型",
    body: "長者肌力和日常生活機能、生活品質密切相關。這一階段的訓練目標是站穩、走路與保留自主，不是追求健美外型。",
    source: "衛生福利部國民健康署",
    url: "https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4306&pid=14190",
    tag: "肌力觀念",
  },
  {
    title: "走路很好，但身體也需要肌力與平衡",
    body: "有氧、肌力、平衡與柔軟度各有不同作用。走路值得保留，再加上簡單肌力與平衡活動，會更完整。",
    source: "新竹臺大分院",
    url: "https://www.hch.gov.tw/?aid=626&iid=481&page_name=detail&pid=58",
    tag: "運動組合",
  },
  {
    title: "現在的四個動作，不是把肌肉練得很大",
    body: "這套低量居家活動以生活功能、肌耐力與建立習慣為目標。肌肉外型是否明顯改變，還會受到訓練量、強度、時間與個人體質影響。",
    source: "國健署全民身體活動指引",
    url: "https://www.hpa.gov.tw/1411/ebc",
    tag: "安心開始",
  },
  {
    title: "沒力氣，正是從簡單版本開始的理由",
    body: "國健署建議依身體狀況先從基礎版開始，等身體功能改善後，再逐步增加強度與時間。",
    source: "衛生福利部國民健康署",
    url: "https://mohw.gov.tw/cp-2704-38873-1.html",
    tag: "漸進原則",
  },
  {
    title: "做一點也有價值",
    body: "建立習慣時，先完成短而安全的活動，比一次做很多卻不想再做更重要。第一階段先練習每週出現 2–3 次。",
    source: "國健署全民身體活動指引",
    url: "https://www.hpa.gov.tw/1411/ebc",
    tag: "微小開始",
  },
  {
    title: "同一肌群也需要休息",
    body: "國健署資料建議老年人每週安排 2–3 天肌力強化，同一肌群兩次訓練之間至少休息一天。",
    source: "國健署社區營養照護作業手冊",
    url: "https://health99.hpa.gov.tw/storage/files/materials/22208-1.pdf",
    tag: "恢復",
  },
  {
    title: "不用去健身房才算運動",
    body: "在家利用椅子、牆面與彈力帶，也能安排肌力和平衡活動；重點是環境安全、動作適合並持續進行。",
    source: "衛生福利部國民健康署",
    url: "https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4306&pid=14190",
    tag: "居家運動",
  },
  {
    title: "肌力與平衡，是防跌的重要一環",
    body: "跌倒原因很多，不能只靠運動解決；但規律肌力與平衡活動，加上安全環境與正確用藥，是官方防跌建議的重要組合。",
    source: "衛生福利部國民健康署",
    url: "https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1193",
    tag: "防跌",
  },
  {
    title: "慢慢增加，比硬撐更適合長期進步",
    body: "先依當天體力選擇基礎版本；只有在沒有明顯不舒服、動作穩定且願意再做時，才逐步增加。",
    source: "衛生福利部國民健康署",
    url: "https://www.mohw.gov.tw/fp-16-61959-1.html",
    tag: "安全進階",
  },
  {
    title: "不疼痛，是居家運動的基本原則",
    body: "動作可以有出力感，但不以疼痛為進步標準。出現疼痛時先停止，不要為了完成次數而硬撐。",
    source: "衛生福利部國民健康署",
    url: "https://www.mohw.gov.tw/fp-16-61959-1.html",
    tag: "疼痛原則",
  },
  {
    title: "規律比一次做很多更重要",
    body: "這個月先累積可重複的經驗。完成、做一點或因安全而休息，都比勉強衝量更有助於理解身體。",
    source: "衛生福利部國民健康署",
    url: "https://mohw.gov.tw/cp-2704-38873-1.html",
    tag: "建立規律",
  },
  {
    title: "不同活動，照顧身體不同能力",
    body: "騎車、跑步和走路主要支持心肺耐力；坐站、划船等則提供肌力刺激。不是互相取代，而是彼此補充。",
    source: "新竹臺大分院",
    url: "https://www.hch.gov.tw/?aid=626&iid=481&page_name=detail&pid=58",
    tag: "運動多樣性",
  },
  {
    title: "動作做小一點，也是一種調整",
    body: "今天狀態不同，可以減少次數、縮小幅度、增加扶持或只做一個動作。主動調整不是退步。",
    source: "國健署動動生活手冊",
    url: "https://health.hpa.gov.tw/common/Download.ashx?f=99227048-047b-4a5b-b56b-e0fd91b35b48.pdf&o=2.%E5%8B%95%E5%8B%95%E7%94%9F%E6%B4%BB%28%E6%89%8B%E5%86%8A%29.pdf",
    tag: "彈性調整",
  },
  {
    title: "椅子和桌子首先要穩",
    body: "居家訓練前先確認椅子不會滑動、桌面穩固、地面乾燥、照明足夠，並清掉腳邊雜物。",
    source: "衛生福利部國民健康署",
    url: "https://www.mohw.gov.tw/cp-16-70698-1.html",
    tag: "環境安全",
  },
  {
    title: "鞋子與地面，也會影響安全",
    body: "防滑、合腳且固定良好的鞋子，以及乾燥平整的地面，是長者防跌建議的一部分。",
    source: "衛生福利部國民健康署",
    url: "https://www.mohw.gov.tw/cp-16-78029-1.html",
    tag: "防跌環境",
  },
  {
    title: "運動時記得呼吸",
    body: "慢慢出力，不要刻意憋氣。若呼吸明顯不順、胸悶或感覺異常，應立即停止並告訴家人。",
    source: "臺中榮民總醫院",
    url: "https://www.vghtc.gov.tw/UploadFiles/WebFiles/WebPagesFiles/Files/dc67b5eb-7791-4d27-b702-db688398b876/%E5%BF%83%E8%87%9F%E7%89%A9%E7%90%86%E6%B2%BB%E7%99%82%E8%A1%9B%E6%95%99%E5%96%AE%E5%BC%B5.pdf",
    tag: "呼吸",
  },
  {
    title: "曾經跌倒，要先理解原因與恢復狀態",
    body: "跌倒可能牽涉肌力、疾病、用藥、視力與環境等多種因素。近期跌倒或仍有症狀時，進階前先請合格專業人員評估。",
    source: "衛生福利部國民健康署",
    url: "https://www.hpa.gov.tw/Pages/EBook.aspx?nodeid=1193",
    tag: "跌倒後",
  },
  {
    title: "胸悶、頭暈或冒冷汗，不是硬撐的時候",
    body: "運動中若出現胸悶、頭暈、噁心、冒冷汗、呼吸困難或其他異常不適，立即停止，並依嚴重程度尋求醫療協助。",
    source: "臺大醫院",
    url: "https://epaper.ntuh.gov.tw/health/202205/health_2.html",
    tag: "停止訊號",
  },
  {
    title: "今天覺得輕鬆，不代表要立刻加倍",
    body: "先觀察隔天的身體反應與下次意願。穩定完成幾次後，每次只調整一項：次數、組數、阻力或動作難度。",
    source: "國健署全民身體活動指引",
    url: "https://www.hpa.gov.tw/1411/ebc",
    tag: "漸進負荷",
  },
  {
    title: "運動紀錄不是考卷",
    body: "紀錄的用途是找出合適節奏：什麼時間容易開始、哪個動作不舒服、什麼方法能降低阻力，而不是評分或比較。",
    source: "國健署動動生活手冊",
    url: "https://health.hpa.gov.tw/common/Download.ashx?f=99227048-047b-4a5b-b56b-e0fd91b35b48.pdf&o=2.%E5%8B%95%E5%8B%95%E7%94%9F%E6%B4%BB%28%E6%89%8B%E5%86%8A%29.pdf",
    tag: "紀錄目的",
  },
];

const week = [
  { weekday: "一", date: "10", status: "done" },
  { weekday: "二", date: "11", status: "empty" },
  { weekday: "三", date: "12", status: "empty" },
  { weekday: "四", date: "13", status: "empty" },
  { weekday: "五", date: "14", status: "empty" },
  { weekday: "六", date: "15", status: "empty" },
  { weekday: "日", date: "16", status: "empty" },
];

function AppIcon({ name }: { name: "sun" | "book" | "leaf" | "calendar" }) {
  const icons = { sun: "☀", book: "知", leaf: "葉", calendar: "週" };
  return <span className="app-icon" aria-hidden="true">{icons[name]}</span>;
}

export default function Home() {
  const [personId, setPersonId] = useState<PersonId>("dad");
  const [view, setView] = useState<ViewId>("today");
  const [conceptIndex, setConceptIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const person = people[personId];
  const concept = conceptCards[conceptIndex];
  const dailyIndex = useMemo(() => new Date().getDate() % conceptCards.length, []);

  const copyReport = async () => {
    const template = `日期：\n今天：□ 完成  □ 做一點  □ 休息\n椅子坐站：___ 下 × ___ 組\n扶牆踮腳：___ 下 × ___ 組\n划船：___ 下 × ___ 組（□ 空手  □ 彈力帶：___）\n扶桌髖鉸鏈：___ 下 × ___ 組（□ 空手  □ 負重：___ kg）\n大約：___ 分鐘\n協助：□ 自己完成  □ 有扶持  □ 有人協助\n身體：□ 舒服  □ 有點累  □ 不舒服（哪裡：___）\n下次：□ 願意再做  □ 看狀況  □ 想先調整`;
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const goConcept = (direction: number) => {
    setConceptIndex((current) => (current + direction + conceptCards.length) % conceptCards.length);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#main" className="brand" aria-label="自在動一點首頁">
          <span className="brand-mark">自</span>
          <span>自在動一點</span>
        </a>
        <div className="header-note">安全・規律・做得到</div>
      </header>

      <main id="main" className="app-frame">
        <div className="person-switch" role="tablist" aria-label="選擇家庭成員">
          {(Object.keys(people) as PersonId[]).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={personId === id}
              className="person-button"
              onClick={() => setPersonId(id)}
            >
              {people[id].label}
            </button>
          ))}
        </div>

        {view === "today" && (
          <div className="view-stack">
            <section className="hero-card">
              <div className="hero-kicker">今天的溫和肌力</div>
              <h1>{person.greeting}</h1>
              <p>{person.framing}</p>
              <div className="hero-summary">
                <div>
                  <span>今天</span>
                  <strong>4 個動作</strong>
                </div>
                <div>
                  <span>大約</span>
                  <strong>5–8 分鐘</strong>
                </div>
                <div>
                  <span>本週</span>
                  <strong>1／3 次</strong>
                </div>
              </div>
            </section>

            <section aria-labelledby="week-title">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">這一週</div>
                  <h2 id="week-title">累積出現，不必連續</h2>
                </div>
                <span className="status-key"><i /> 已完成</span>
              </div>
              <div className="week-grid">
                {week.map((day) => (
                  <div key={day.date} className={`day-cell ${day.status}`}>
                    <span>{day.weekday}</span>
                    <strong>{day.date}</strong>
                    <small>{day.status === "done" ? "完成" : "—"}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="daily-concept" aria-labelledby="daily-concept-title">
              <div className="concept-topline">
                <span><AppIcon name="sun" /> 今日觀念</span>
                <button type="button" onClick={() => { setConceptIndex(dailyIndex); setView("learn"); }}>看更多觀念</button>
              </div>
              <h2 id="daily-concept-title">{conceptCards[dailyIndex].title}</h2>
              <p>{conceptCards[dailyIndex].body}</p>
              <a href={conceptCards[dailyIndex].url} target="_blank" rel="noreferrer">
                來源：{conceptCards[dailyIndex].source}<span aria-hidden="true"> ↗</span>
              </a>
            </section>

            <section aria-labelledby="exercise-title">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">共同起點</div>
                  <h2 id="exercise-title">今天的四個動作</h2>
                </div>
                <span className="section-aside">各 1 組即可</span>
              </div>
              <div className="exercise-list">
                {exercises.map((exercise) => (
                  <details className="exercise-card" key={exercise.number}>
                    <summary>
                      <span className="exercise-number">{exercise.number}</span>
                      <span className="exercise-title">
                        <strong>{exercise.name}</strong>
                        <small>{exercise.functionName}</small>
                      </span>
                      <span className="exercise-reps">{exercise.reps}</span>
                    </summary>
                    <div className="exercise-detail">
                      <ol>{exercise.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                      <p><strong>留意：</strong>{exercise.observe}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="report-card">
              <div>
                <span className="section-kicker">完成後</span>
                <h2>用一分鐘回報今天</h2>
                <p>複製五行範本，貼到家人的共用 Apple Note。</p>
              </div>
              <button type="button" className="primary-action" onClick={copyReport}>
                {copied ? "已複製，可以貼上了" : "複製回報範本"}
              </button>
            </section>

            <aside className="safety-line">
              <strong>今天不舒服就先停。</strong>
              胸痛或胸悶、呼吸困難、嚴重頭暈、冒冷汗、突然無力麻木或劇烈疼痛，應停止活動並依嚴重程度尋求醫療協助。
            </aside>
          </div>
        )}

        {view === "records" && (
          <div className="view-stack">
            <section className="page-intro">
              <div className="section-kicker">{person.label}的運動紀錄</div>
              <h1>每次出現，都留下一點軌跡</h1>
              <p>這裡只記運動與身體感受，不放病歷、用藥或其他私人資料。</p>
            </section>
            <section className="record-month" aria-labelledby="record-title">
              <div className="section-heading">
                <div><div className="section-kicker">2026 年 8 月</div><h2 id="record-title">本月 1 次</h2></div>
                <span className="positive-badge">第一天完成</span>
              </div>
              <div className="record-entry">
                <div className="record-date"><strong>10</strong><span>週一</span></div>
                <div className="record-content">
                  <strong>Day 1・四個動作全部完成</strong>
                  <p>看起來身體舒服，沒有觀察到明顯不適；總分鐘數與次數尚未回報。</p>
                  <div className="record-moves" aria-label="今天完成的四個動作">
                    <span>椅子坐站</span>
                    <span>扶牆踮腳</span>
                    <span>空手划船</span>
                    <span>扶桌髖鉸鏈</span>
                  </div>
                  <small>今天先以空手動作為主，沒有使用彈力帶。</small>
                </div>
              </div>
            </section>
            <section className="empty-guidance">
              <AppIcon name="calendar" />
              <div><h2>下一筆不用更厲害</h2><p>只要再安全完成一次，就是正在建立規律。</p></div>
            </section>
            <section className="trend-preview" aria-labelledby="trend-preview-title">
              <div>
                <span className="section-kicker">累積 3 次後</span>
                <h2 id="trend-preview-title">每個動作會有自己的趨勢</h2>
                <p>分開查看下數、組數與阻力變化，不把四個不同動作混成一個分數。</p>
              </div>
              <div className="mini-trends" aria-label="未來趨勢圖示意，尚無足夠資料">
                <span><i style={{ height: "30%" }} /><i style={{ height: "48%" }} /><i style={{ height: "64%" }} /></span>
                <span><i style={{ height: "42%" }} /><i style={{ height: "42%" }} /><i style={{ height: "58%" }} /></span>
                <span><i style={{ height: "24%" }} /><i style={{ height: "38%" }} /><i style={{ height: "38%" }} /></span>
              </div>
            </section>
          </div>
        )}

        {view === "progress" && (
          <div className="view-stack">
            <section className="page-intro">
              <div className="section-kicker">{person.label}的兩週計畫</div>
              <h1>先把「我做得到」累積起來</h1>
              <p>第一階段不比較重量、流汗或運動量，只看安全、完成與願意再做。</p>
            </section>
            <section className="progress-card">
              <div className="progress-orbit" aria-label="六次目標，目前完成一次">
                <div className="orbit-center"><strong>1</strong><span>／6 次</span></div>
                {[0, 1, 2, 3, 4, 5].map((item) => <i key={item} className={item === 0 ? "earned" : ""} />)}
              </div>
              <div className="progress-copy">
                <span className="positive-badge">第一片葉子</span>
                <h2>願意開始，就是第一個里程碑</h2>
                <p>接下來只需要再累積一次安全、做得到的經驗。</p>
              </div>
            </section>
            <section className="three-principles">
              <article><span>01</span><h2>安全</h2><p>沒有紅旗或異常疼痛。</p></article>
              <article><span>02</span><h2>完成</h2><p>完整或簡化版本都算。</p></article>
              <article><span>03</span><h2>願意再做</h2><p>信心比強度更優先。</p></article>
            </section>
          </div>
        )}

        {view === "learn" && (
          <div className="view-stack">
            <section className="page-intro">
              <div className="section-kicker">有來源的運動觀念</div>
              <h1>一天理解一件事，就夠了</h1>
              <p>目前共 {conceptCards.length} 張，優先採台灣官方與醫學中心衛教；每張都可以查看原始來源。</p>
            </section>
            <article className="learn-card">
              <div className="learn-meta"><span>{concept.tag}</span><span>{conceptIndex + 1}／{conceptCards.length}</span></div>
              <h2>{concept.title}</h2>
              <p>{concept.body}</p>
              <a href={concept.url} target="_blank" rel="noreferrer">查看來源・{concept.source}<span aria-hidden="true"> ↗</span></a>
              <div className="concept-controls">
                <button type="button" onClick={() => goConcept(-1)}>上一張</button>
                <button type="button" onClick={() => goConcept(1)}>下一張</button>
              </div>
            </article>
            <section className="source-policy">
              <h2>我們怎麼選資料</h2>
              <ul>
                <li>優先：台灣衛福部、國健署、醫學中心與公立醫療機構。</li>
                <li>若使用國際指引，會確認是否能合理用於台灣／亞洲長輩，並註明限制。</li>
                <li>不把一般衛教當成個人醫療診斷，也不根據網站自行調藥。</li>
                <li>來源、發布時間或建議改變時，觀念卡要重新審查。</li>
              </ul>
            </section>
          </div>
        )}
      </main>

      <nav className="bottom-navigation" aria-label="網站主要功能">
        {([
          ["today", "今天"],
          ["records", "紀錄"],
          ["progress", "進度"],
          ["learn", "觀念"],
        ] as [ViewId, string][]).map(([id, label]) => (
          <button key={id} type="button" className={view === id ? "active" : ""} aria-current={view === id ? "page" : undefined} onClick={() => setView(id)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
