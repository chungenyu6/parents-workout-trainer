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

type WorkoutRecord = {
  date: string;
  day: string;
  sortDate?: string;
  label: string;
  minutes?: number;
  chairStandReps?: number;
  calfRaiseReps?: number;
  rowReps?: number;
  rowEquipment?: "red-band";
  rowBandCount?: number;
  hipHingeReps?: number;
  sets: number;
  summary: string;
  completedMoves?: 2 | 3 | 4;
  planId?: "A" | "B";
  exerciseResults?: Array<{
    name: string;
    reps: number;
    sets: number;
    equipment: "red-band" | "yellow-band" | "bodyweight";
  }>;
  skippedExercises?: string[];
  conditionNote?: string;
  additionalBandSets?: number;
  bandSetScope?: "row";
  bandReps?: number;
  bandColor?: "red";
  bandCount?: number;
  bandResistance?: "light";
  equipmentStatus?: "unknown" | "band";
};

type ActivityRecord = {
  date: string;
  day: string;
  sortDate?: string;
  activity: "散步";
  minutes?: number;
};

type NoStrengthRecord = {
  date: string;
  day: string;
  sortDate?: string;
  summary: string;
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

const trainingPlans = [
  {
    id: "A",
    days: "週二・週五",
    dates: "10/6・10/9",
    exercises: ["彈力帶胸推", "彈力帶肩推", "深蹲", "提踵"],
  },
  {
    id: "B",
    days: "週三・週六",
    dates: "10/7・10/10",
    exercises: ["彈力帶划船", "彈力帶擴胸", "深蹲", "提踵"],
  },
];

const bandCatalog = [
  { color: "黃色", className: "yellow", level: "超輕", pounds: "2–5 lbs", use: "復健初期、肩頸放鬆、銀髮族" },
  { color: "紅色", className: "red", level: "輕", pounds: "6–10 lbs", use: "初學者上肢、瑜珈輔助" },
  { color: "綠色", className: "green", level: "中", pounds: "10–15 lbs", use: "日常訓練、女生全身可用" },
  { color: "藍色", className: "blue", level: "中強", pounds: "15–20 lbs", use: "臀腿訓練、男生上肢" },
  { color: "黑色", className: "black", level: "強", pounds: "20–30 lbs", use: "進階肌力、深蹲加阻" },
  { color: "紫／銀", className: "purple", level: "超強", pounds: "30+ lbs", use: "力量訓練者專用" },
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
  { weekday: "一", date: "10/5", sortDate: "2026-10-05" },
  { weekday: "二", date: "10/6", sortDate: "2026-10-06" },
  { weekday: "三", date: "10/7", sortDate: "2026-10-07" },
  { weekday: "四", date: "10/8", sortDate: "2026-10-08" },
  { weekday: "五", date: "10/9", sortDate: "2026-10-09" },
  { weekday: "六", date: "10/10", sortDate: "2026-10-10" },
];

const workoutRecords: Record<PersonId, WorkoutRecord[]> = {
  dad: [
    { date: "7", day: "週三", sortDate: "2026-10-07", label: "Day 31", planId: "B", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶划船", reps: 10, sets: 3, equipment: "red-band" },
      { name: "彈力帶擴胸", reps: 10, sets: 3, equipment: "red-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 B 日四個動作，各 10 下 × 3 組；上半身使用紅色彈力帶（6–10 lbs），深蹲與提踵徒手。" },
    { date: "6", day: "週二", sortDate: "2026-10-06", label: "Day 30", planId: "A", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶胸推", reps: 10, sets: 3, equipment: "red-band" },
      { name: "彈力帶肩推", reps: 10, sets: 3, equipment: "red-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 A 日四個動作，各 10 下 × 3 組；上半身使用紅色彈力帶（6–10 lbs），深蹲與提踵徒手。" },
    { date: "3", day: "週六", sortDate: "2026-10-03", label: "Day 29", planId: "B", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶划船", reps: 10, sets: 3, equipment: "red-band" },
      { name: "彈力帶擴胸", reps: 10, sets: 3, equipment: "red-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 B 日四個動作，各 10 下 × 3 組；上半身使用紅色彈力帶（6–10 lbs），深蹲與提踵徒手。" },
    { date: "2", day: "週五", sortDate: "2026-10-02", label: "Day 28", planId: "A", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶胸推", reps: 10, sets: 3, equipment: "red-band" },
      { name: "彈力帶肩推", reps: 10, sets: 3, equipment: "red-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 A 日四個動作，各 10 下 × 3 組；上半身使用紅色彈力帶（6–10 lbs），深蹲與提踵徒手。" },
    { date: "30", day: "週三", sortDate: "2026-09-30", label: "Day 27", planId: "B", sets: 4, completedMoves: 4, exerciseResults: [
      { name: "彈力帶划船", reps: 10, sets: 4, equipment: "red-band" },
      { name: "彈力帶擴胸", reps: 10, sets: 4, equipment: "red-band" },
      { name: "深蹲", reps: 10, sets: 4, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 4, equipment: "bodyweight" },
    ], summary: "完成 B 日四個動作，各 10 下 × 4 組；上半身使用紅色彈力帶（6–10 lbs），深蹲與提踵徒手。" },
    { date: "23", day: "週三", sortDate: "2026-09-23", label: "Day 26", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "22", day: "週二", sortDate: "2026-09-22", label: "Day 25", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "20", day: "週日", sortDate: "2026-09-20", label: "Day 24", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "18", day: "週五", sortDate: "2026-09-18", label: "Day 23", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "17", day: "週四", sortDate: "2026-09-17", label: "Day 22", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "早上完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "16", day: "週三", sortDate: "2026-09-16", label: "Day 21", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "四個動作各完成 30 下 × 5 組；做完感覺蠻累。" },
    { date: "15", day: "週二", sortDate: "2026-09-15", label: "Day 20", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, additionalBandSets: 1, bandSetScope: "row", bandReps: 10, bandColor: "red", bandCount: 2, bandResistance: "light", equipmentStatus: "band", summary: "四個動作各完成 10 下 × 3 組；空手划船另加 1 組紅色彈力帶 10 下（每次 2 條）。" },
    { date: "13", day: "週日", sortDate: "2026-09-13", label: "Day 19", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, additionalBandSets: 1, bandSetScope: "row", bandReps: 10, bandColor: "red", bandCount: 2, bandResistance: "light", equipmentStatus: "band", summary: "四個動作各完成 10 下 × 3 組；空手划船另加 1 組紅色彈力帶 10 下（每次 2 條）。" },
    { date: "10", day: "週四", sortDate: "2026-09-10", label: "Day 18", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "9", day: "週三", sortDate: "2026-09-09", label: "Day 17", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "7", day: "週一", sortDate: "2026-09-07", label: "Day 16", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "6", day: "週日", sortDate: "2026-09-06", label: "Day 15", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "4", day: "週五", sortDate: "2026-09-04", label: "Day 14", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "3", day: "週四", sortDate: "2026-09-03", label: "Day 13", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "31", day: "週一", label: "Day 12", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, completedMoves: 4, summary: "四個動作各完成 10 下 × 1 組；其他細節與身體感受未回報。" },
    { date: "24", day: "週一", label: "Day 11", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "在機場完成四個動作，各 10 下 × 2 組（依回報暫記）；其他細節與身體感受未回報。" },
    { date: "23", day: "週日", label: "Day 10", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "22", day: "週六", label: "Day 9", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "21", day: "週五", label: "Day 8", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "19", day: "週三", label: "Day 7", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "18", day: "週二", label: "Day 6", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "17", day: "週一", label: "Day 5", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, sets: 2, completedMoves: 3, summary: "前三個動作各完成 10 下 × 2 組；扶桌髖鉸鏈未進行。其他細節與身體感受未回報。" },
    { date: "15", day: "週六", label: "Day 4", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, summary: "總分鐘數、協助程度與身體感受未回報。" },
    { date: "14", day: "週五", label: "Day 3", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, summary: "總分鐘數、協助程度與身體感受未回報。" },
    { date: "11", day: "週二", label: "Day 2", minutes: 20, hipHingeReps: 10, sets: 1, summary: "約 20 分鐘，自己完成；身體感覺舒服，並願意下次再做。" },
    { date: "10", day: "週一", label: "Day 1", minutes: 20, hipHingeReps: 10, sets: 1, summary: "約 20 分鐘，自己完成；身體感覺舒服，並願意下次再做。" },
  ],
  mom: [
    { date: "7", day: "週三", sortDate: "2026-10-07", label: "Day 30", planId: "B", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶划船", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "彈力帶擴胸", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 B 日四個動作，各 10 下 × 3 組；上半身使用黃色彈力帶（2–5 lbs），深蹲與提踵徒手。" },
    { date: "6", day: "週二", sortDate: "2026-10-06", label: "Day 29", planId: "A", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶胸推", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "彈力帶肩推", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 A 日四個動作，各 10 下 × 3 組；上半身使用黃色彈力帶（2–5 lbs），深蹲與提踵徒手。" },
    { date: "4", day: "週日", sortDate: "2026-10-04", label: "Day 28", planId: "B", sets: 3, completedMoves: 2, exerciseResults: [
      { name: "彈力帶划船", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "彈力帶擴胸", reps: 10, sets: 3, equipment: "yellow-band" },
    ], summary: "使用黃色彈力帶（2–5 lbs）完成 B 日剩餘的兩個上半身動作，各 10 下 × 3 組；與 10 月 3 日的徒手部分合併完成整套 B 日訓練。" },
    { date: "3", day: "週六", sortDate: "2026-10-03", label: "Day 27", planId: "B", sets: 3, completedMoves: 2, exerciseResults: [
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 B 日徒手部分，深蹲與提踵各 10 下 × 3 組；當天未使用彈力帶，上半身彈力帶動作於 10 月 4 日補完。" },
    { date: "2", day: "週五", sortDate: "2026-10-02", label: "Day 26", planId: "A", sets: 3, completedMoves: 4, exerciseResults: [
      { name: "彈力帶胸推", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "彈力帶肩推", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "深蹲", reps: 10, sets: 3, equipment: "bodyweight" },
      { name: "提踵", reps: 10, sets: 3, equipment: "bodyweight" },
    ], summary: "完成 A 日四個動作，各 10 下 × 3 組；上半身使用黃色彈力帶（2–5 lbs），深蹲與提踵徒手。" },
    { date: "30", day: "週三", sortDate: "2026-09-30", label: "Day 25", planId: "B", sets: 3, completedMoves: 2, exerciseResults: [
      { name: "彈力帶划船", reps: 10, sets: 3, equipment: "yellow-band" },
      { name: "彈力帶擴胸", reps: 10, sets: 3, equipment: "yellow-band" },
    ], skippedExercises: ["深蹲", "提踵"], conditionNote: "依回報：跌倒造成雙膝受傷；左膝疑似瘀青，右膝有大面積擦破皮。", summary: "依回報暫記完成 B 日上半身兩個動作，各 10 下 × 3 組，使用黃色彈力帶（2–5 lbs）；腿部動作未進行。" },
    { date: "22", day: "週二", sortDate: "2026-09-22", label: "Day 24", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "21", day: "週一", sortDate: "2026-09-21", label: "Day 23", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "17", day: "週四", sortDate: "2026-09-17", label: "Day 22", chairStandReps: 30, calfRaiseReps: 30, rowReps: 30, rowEquipment: "red-band", rowBandCount: 2, hipHingeReps: 30, sets: 5, completedMoves: 4, summary: "早上完成四個動作，各 30 下 × 5 組；僅拉背使用 2 條紅色彈力帶，其餘徒手。" },
    { date: "15", day: "週二", sortDate: "2026-09-15", label: "Day 21", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, additionalBandSets: 1, bandSetScope: "row", bandReps: 10, bandColor: "red", bandCount: 2, bandResistance: "light", equipmentStatus: "band", summary: "四個動作各完成 10 下 × 3 組；空手划船另加 1 組紅色彈力帶 10 下（每次 2 條）。" },
    { date: "13", day: "週日", sortDate: "2026-09-13", label: "Day 20", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作皆徒手完成，各 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "10", day: "週四", sortDate: "2026-09-10", label: "Day 19", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "9", day: "週三", sortDate: "2026-09-09", label: "Day 18", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "7", day: "週一", sortDate: "2026-09-07", label: "Day 17", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "6", day: "週日", sortDate: "2026-09-06", label: "Day 16", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "4", day: "週五", sortDate: "2026-09-04", label: "Day 15", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 3, completedMoves: 4, summary: "四個動作各完成 10 下 × 3 組；其他細節與身體感受未回報。" },
    { date: "3", day: "週四", sortDate: "2026-09-03", label: "Day 14", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "29", day: "週六", label: "Day 13", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, completedMoves: 4, summary: "四個動作各完成 10 下 × 1 組；其他細節與身體感受未回報。" },
    { date: "24", day: "週一", label: "Day 12", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "在機場完成四個動作，各 10 下 × 2 組（依回報暫記）；其他細節與身體感受未回報。" },
    { date: "23", day: "週日", label: "Day 11", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "22", day: "週六", label: "Day 10", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "21", day: "週五", label: "Day 9", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "19", day: "週三", label: "Day 8", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "18", day: "週二", label: "Day 7", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "17", day: "週一", label: "Day 6", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 2, completedMoves: 4, summary: "四個動作各完成 10 下 × 2 組；其他細節與身體感受未回報。" },
    { date: "15", day: "週六", label: "Day 5", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, summary: "總分鐘數、協助程度與身體感受未回報。" },
    { date: "14", day: "週五", label: "Day 4", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, summary: "總分鐘數、協助程度與身體感受未回報。" },
    { date: "13", day: "週四", label: "Day 3", chairStandReps: 10, calfRaiseReps: 10, rowReps: 10, hipHingeReps: 10, sets: 1, summary: "總分鐘數、協助程度與身體感受未回報。" },
    { date: "11", day: "週二", label: "Day 2", minutes: 20, hipHingeReps: 10, sets: 1, summary: "約 20 分鐘，自己完成；身體感覺舒服，並願意下次再做。" },
    { date: "10", day: "週一", label: "Day 1", minutes: 20, hipHingeReps: 10, sets: 1, summary: "約 20 分鐘，自己完成；身體感覺舒服，並願意下次再做。" },
  ],
};

const activityRecords: Record<PersonId, ActivityRecord[]> = {
  dad: [
    { date: "24", day: "週四", sortDate: "2026-09-24", activity: "散步", minutes: 60 },
    { date: "5", day: "週六", sortDate: "2026-09-05", activity: "散步", minutes: 60 },
    { date: "13", day: "週四", activity: "散步" },
    { date: "12", day: "週三", activity: "散步", minutes: 60 },
  ],
  mom: [
    { date: "24", day: "週四", sortDate: "2026-09-24", activity: "散步", minutes: 60 },
    { date: "5", day: "週六", sortDate: "2026-09-05", activity: "散步", minutes: 60 },
    { date: "12", day: "週三", activity: "散步", minutes: 60 },
  ],
};

const noStrengthRecords: Record<PersonId, NoStrengthRecord[]> = {
  dad: [
    { date: "21", day: "週一", sortDate: "2026-09-21", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "19", day: "週六", sortDate: "2026-09-19", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "12", day: "週六", sortDate: "2026-09-12", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "11", day: "週五", sortDate: "2026-09-11", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "16", day: "週日", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
  ],
  mom: [
    { date: "23", day: "週三", sortDate: "2026-09-23", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "20", day: "週日", sortDate: "2026-09-20", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "19", day: "週六", sortDate: "2026-09-19", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "18", day: "週五", sortDate: "2026-09-18", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "16", day: "週三", sortDate: "2026-09-16", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "12", day: "週六", sortDate: "2026-09-12", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "11", day: "週五", sortDate: "2026-09-11", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "31", day: "週一", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
    { date: "16", day: "週日", summary: "未進行肌力訓練；其他活動、原因與身體感受未回報。此筆不標示為失敗，也不推測為主動休息。" },
  ],
};

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
  const personRecords = workoutRecords[personId];
  const personActivities = activityRecords[personId];
  const personNoStrengthRecords = noStrengthRecords[personId];
  const bandColor = personId === "dad" ? "紅色" : "黃色";
  const bandPounds = personId === "dad" ? "6–10 lbs" : "2–5 lbs";
  const timelineRecords = [
    ...personRecords.map((record) => ({ ...record, kind: "strength" as const })),
    ...personActivities.map((record) => ({ ...record, kind: "walk" as const })),
    ...personNoStrengthRecords.map((record) => ({ ...record, kind: "no-strength" as const })),
  ].sort((a, b) => {
    const aDate = a.sortDate ?? `2026-08-${a.date.padStart(2, "0")}`;
    const bDate = b.sortDate ?? `2026-08-${b.date.padStart(2, "0")}`;
    return bDate.localeCompare(aDate);
  });
  const strengthCount = personRecords.length;
  const activityCount = personActivities.length;
  const octoberStrengthRecords = personRecords.filter((record) => record.sortDate?.startsWith("2026-10-"));
  const octoberWalkRecords = personActivities.filter((record) => record.sortDate?.startsWith("2026-10-"));
  const octoberNoStrengthRecords = personNoStrengthRecords.filter((record) => record.sortDate?.startsWith("2026-10-"));
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthDays = Array.from({ length: 31 }, (_, index) => {
    const date = String(index + 1);
    const strength = octoberStrengthRecords.find((record) => record.date === date);
    const walk = octoberWalkRecords.find((record) => record.date === date);
    const noStrength = octoberNoStrengthRecords.find((record) => record.date === date);
    const calendarDate = new Date(2026, 9, index + 1);
    const isFuture = calendarDate > todayStart;

    if (strength) return { date, status: "strength", detail: `${strength.sets} 組`, label: `10 月 ${date} 日，肌力 ${strength.sets} 組` };
    if (walk) return { date, status: "walk", detail: walk.minutes ? `${walk.minutes} 分` : "散步", label: `10 月 ${date} 日，散步${walk.minutes ? ` ${walk.minutes} 分鐘` : ""}` };
    if (noStrength) return { date, status: "no-strength", detail: "未做肌力", label: `10 月 ${date} 日，未進行肌力訓練` };
    if (isFuture) return { date, status: "future", detail: "", label: `10 月 ${date} 日，尚未到達` };
    return { date, status: "empty", detail: "未回報", label: `10 月 ${date} 日，尚未回報` };
  });
  const concept = conceptCards[conceptIndex];
  const dailyIndex = useMemo(() => new Date().getDate() % conceptCards.length, []);
  const travelNotice = (
    <aside className="travel-notice">
      <span className="section-kicker">8 月 24 日至 9 月 2 日</span>
      <h2>歐洲旅行期間，以行程與休息為優先</h2>
      <p>爸爸、媽媽將外出旅行。這段時間未回報肌力，不表示失敗，也不推測為主動休息；若有合適的活動，再視情況留下紀錄。</p>
    </aside>
  );

  const copyReport = async () => {
    const template = `日期：\n${person.label}：□ A（週二／五） □ B（週三／六）\n今天：□ 完成  □ 做一點  □ 休息\n每個動作：10 下 × 3 組\n彈力帶：${bandColor}（${bandPounds}）\n大約：___ 分鐘\n協助：□ 自己完成  □ 有扶持  □ 有人協助\n身體：□ 舒服  □ 有點累  □ 不舒服（哪裡：___）\n下次：□ 願意再做  □ 看狀況  □ 想先調整`;
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
              <h1>今天尚未回報肌力</h1>
              <p>{person.label}今天的肌力、其他活動與身體感受尚未回報。</p>
              <div className="hero-summary">
                <div>
                  <span>今天</span>
                  <strong>尚未回報</strong>
                </div>
                <div>
                  <span>其他活動</span>
                  <strong>{activityCount} 次</strong>
                </div>
                <div>
                  <span>本週肌力・目標 3</span>
                  <strong>{strengthCount} 次</strong>
                </div>
              </div>
            </section>

            <section aria-labelledby="week-title">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">這一週</div>
                  <h2 id="week-title">累積出現，不必連續</h2>
                </div>
                <div className="status-keys" aria-label="週曆圖例">
                  <span className="status-key"><i /> 肌力</span>
                  <span className="status-key walk-key"><i /> 散步</span>
                  <span className="status-key no-strength-key"><i /> 未做肌力</span>
                </div>
              </div>
              <div className="week-grid">
                {week.map((day) => (
                  (() => {
                    const status = personRecords.some((record) => record.sortDate === day.sortDate)
                      ? "done"
                      : personActivities.some((record) => record.sortDate === day.sortDate)
                        ? "walk"
                        : personNoStrengthRecords.some((record) => record.sortDate === day.sortDate)
                          ? "no-strength"
                          : "empty";
                    return <div key={day.sortDate} className={`day-cell ${status}`}>
                    <span>{day.weekday}</span>
                    <strong>{day.date}</strong>
                    <small>{status === "done" ? "肌力" : status === "walk" ? "散步" : status === "no-strength" ? "未做肌力" : "—"}</small>
                    </div>;
                  })()
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

            <section aria-labelledby="exercise-title" className="training-program">
              <div className="section-heading">
                  <div>
                    <div className="section-kicker">10/5—10/10 本週課表</div>
                  <h2 id="exercise-title">兩種訓練日，交替進行</h2>
                  </div>
                <span className={`band-chip ${personId === "dad" ? "red" : "yellow"}`}>
                  <i aria-hidden="true" />{person.label}・{bandColor}彈力帶 {bandPounds}
                </span>
              </div>
              <div className="training-plan-grid">
                {trainingPlans.map((plan) => (
                  <article className="training-plan-card" key={plan.id}>
                    <header>
                      <span className="plan-letter">{plan.id}</span>
                      <div>
                        <strong>{plan.days}</strong>
                        <small>{plan.dates}</small>
                      </div>
                      <span className="plan-dose">10 下 × 3 組</span>
                    </header>
                    <ol>
                      {plan.exercises.map((exercise, index) => (
                        <li key={exercise}>
                          <span>{index + 1}</span>
                          <strong>{exercise}</strong>
                          <small>{exercise.startsWith("彈力帶") ? `${bandColor}彈力帶` : "徒手"}</small>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
              <details className="band-reference">
                <summary>查看完整彈力帶阻力表</summary>
                <div className="band-table" role="table" aria-label="彈力帶顏色與阻力對照">
                  {bandCatalog.map((band) => (
                    <div className="band-row" role="row" key={band.color}>
                      <span role="cell" className="band-color"><i className={band.className} aria-hidden="true" />{band.color}</span>
                      <strong role="cell">{band.level}</strong>
                      <span role="cell">{band.pounds}</span>
                      <small role="cell">{band.use}</small>
                    </div>
                  ))}
                </div>
              </details>
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
            {travelNotice}
            <section className="activity-map" aria-labelledby="activity-map-title">
              <div className="activity-map-heading">
                <div>
                  <span className="section-kicker">2026 年 10 月</span>
                  <h2 id="activity-map-title">十月活動地圖</h2>
                  <p>{person.label}本月 {octoberStrengthRecords.length} 次肌力、{octoberWalkRecords.length} 次散步、{octoberNoStrengthRecords.length} 天明確未做肌力。</p>
                </div>
                <div className="activity-legend" aria-label="活動地圖圖例">
                  <span><i className="strength" />肌力</span>
                  <span><i className="walk" />散步</span>
                  <span><i className="no-strength" />未做肌力</span>
                  <span><i className="empty" />未回報</span>
                </div>
              </div>
              <div className="month-grid" role="grid" aria-label={`${person.label} 2026 年 10 月活動紀錄`}>
                {(["一", "二", "三", "四", "五", "六", "日"] as const).map((weekday) => <span className="month-weekday" role="columnheader" key={weekday}>{weekday}</span>)}
                {Array.from({ length: 3 }, (_, index) => <span className="month-offset" aria-hidden="true" key={`offset-${index}`} />)}
                {monthDays.map((day) => (
                  <div className={`month-day ${day.status}`} role="gridcell" aria-label={day.label} key={day.date}>
                    <span>{day.date}</span>
                    <i aria-hidden="true" />
                    <small>{day.detail}</small>
                  </div>
                ))}
              </div>
              <p className="activity-map-note">空白只代表尚未回報；只有明確收到「沒有做」時，才標示為未做肌力。</p>
            </section>
            <section className="record-month" aria-labelledby="record-title">
              <div className="section-heading">
                <div><div className="section-kicker">2026 年 8–10 月</div><h2 id="record-title">{strengthCount} 次肌力・{activityCount} 次散步</h2></div>
                <span className="positive-badge">本週肌力目標已達成</span>
              </div>
              {timelineRecords.map((record) => record.kind === "no-strength" ? (
                <div className="record-entry no-strength-entry" key={`no-strength-${record.sortDate ?? `${record.date}-${record.day}`}`}>
                  <div className="record-date"><strong>{record.date}</strong><span>{record.day}</span></div>
                  <div className="record-content">
                    <strong>未進行肌力訓練</strong>
                    <p>{record.summary}</p>
                    <small>不列入肌力訓練次數，也不對未回報的內容做推測。</small>
                  </div>
                </div>
              ) : record.kind === "walk" ? (
                <div className="record-entry walk-entry" key={`walk-${record.sortDate ?? `${record.date}-${record.day}`}`}>
                  <div className="record-date"><strong>{record.date}</strong><span>{record.day}</span></div>
                  <div className="record-content">
                    <strong>散步・{record.minutes ? `${record.minutes} 分鐘` : "時間未回報"}</strong>
                    <p>這天以散步作為其他活動，沒有肌力訓練紀錄。</p>
                    <div className="record-moves" aria-label={`${record.day}完成的其他活動`}>
                      <span>散步：{record.minutes ? `${record.minutes} 分鐘` : "時間未記錄"}</span>
                    </div>
                    <small>速度、距離與身體感受尚未回報；不列入肌力訓練次數。</small>
                  </div>
                </div>
              ) : (
                <div className="record-entry" key={`strength-${record.sortDate ?? `${record.date}-${record.label}`}`}>
                  <div className="record-date"><strong>{record.date}</strong><span>{record.day}</span></div>
                  <div className="record-content">
                    <strong>{record.label}・{record.planId ? `${record.planId} 日${record.completedMoves === 4 ? "全部完成" : `完成 ${record.completedMoves} 個動作`}` : record.completedMoves === 3 ? "完成前三個動作" : "四個動作全部完成"}</strong>
                    <p>{record.summary}</p>
                    {record.exerciseResults ? (
                      <>
                        <div className="record-moves" aria-label={`${record.label} 完成的動作`}>
                          {record.exerciseResults.map((exercise) => (
                            <span key={exercise.name}>{exercise.name}：{exercise.reps} 下 × {exercise.sets} 組（{exercise.equipment === "red-band" ? "紅色彈力帶・6–10 lbs" : exercise.equipment === "yellow-band" ? "黃色彈力帶・2–5 lbs" : "徒手"}）</span>
                          ))}
                          {record.skippedExercises?.map((exercise) => <span className="skipped-move" key={exercise}>{exercise}：未進行</span>)}
                        </div>
                        {record.conditionNote ? <small className="condition-note">身體狀況：{record.conditionNote}</small> : null}
                      </>
                    ) : (
                      <>
                        <div className="record-moves" aria-label={`${record.label} 完成的四個動作`}>
                          <span>椅子坐站：{record.chairStandReps ? `${record.chairStandReps} 下` : "未記錄下數"} × {record.sets} 組</span>
                          <span>扶牆踮腳：{record.calfRaiseReps ? `${record.calfRaiseReps} 下` : "未記錄下數"} × {record.sets} 組</span>
                          <span>{record.rowEquipment === "red-band" ? "彈力帶划船" : "空手划船"}：{record.rowReps ? `${record.rowReps} 下` : "未記錄下數"} × {record.sets} 組{record.rowEquipment === "red-band" ? `（紅色彈力帶 × ${record.rowBandCount ?? "？"} 條）` : ""}</span>
                          <span>扶桌髖鉸鏈：{record.hipHingeReps ? `${record.hipHingeReps} 下` : record.completedMoves === 3 ? "未完成" : "未記錄下數"}{record.hipHingeReps ? ` × ${record.sets} 組` : ""}</span>
                          {record.additionalBandSets ? <span>{record.bandSetScope === "row" ? `空手划船另加 ${record.additionalBandSets} 組紅色彈力帶：${record.bandReps ?? "未記錄"} 下 × ${record.bandCount ?? "？"} 條` : `彈力帶動作：${record.additionalBandSets} 組（動作、下數待補）`}</span> : null}
                        </div>
                        <small>{record.rowEquipment === "red-band" ? "僅拉背使用紅色彈力帶，每次 2 條；單條標示約 6–10 lbs，其餘動作徒手。" : record.bandSetScope === "row" ? "僅空手划船使用紅色彈力帶，每次 2 條；單條標示約 6–10 lbs，彈力帶組每組 10 下。" : record.additionalBandSets ? "另有彈力帶動作；對應動作與下數待補。" : record.equipmentStatus === "band" ? "有使用彈力帶；對應動作與下數待補。" : record.equipmentStatus === "unknown" ? "是否使用彈力帶或額外負重待補。" : record.completedMoves === 3 ? "前三個動作皆為空手；扶桌髖鉸鏈未進行。" : "四個動作皆為空手，未使用彈力帶或額外負重。"}</small>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </section>
            <section className="empty-guidance">
              <AppIcon name="calendar" />
              <div><h2>下一筆不用更厲害</h2><p>只要再安全完成一次，就是正在建立規律。</p></div>
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
              <div className="progress-orbit" aria-label={`六次目標，目前完成${strengthCount}次`}>
                <div className="orbit-center"><strong>{strengthCount}</strong><span>／6 次</span></div>
                {[0, 1, 2, 3, 4, 5].map((item) => <i key={item} className={item < strengthCount ? "earned" : ""} />)}
              </div>
              <div className="progress-copy">
                <span className="positive-badge">{strengthCount} 次肌力累積</span>
                <h2>本週目標已達成，恢復也是計畫的一部分</h2>
                <p>本週整體回報是舒服、輕鬆。接下來不必為了連續紀錄而硬做；留意身體反應，再安排下一次做得到的訓練。</p>
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
