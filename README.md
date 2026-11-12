# 💨 공조 덕트 규격 산정 시스템 [MANMIN-Ver5.1.1]

## v6.1.2 (2026-11-12) — 건물개요 창 표 모양 고정

- 건물개요 공통 원본 MM-PROJECT v1.2 → v1.3(불러오기 창 표 칸 모양 고정 — 도구 CSS 가 새지 않음 · 저장값 같음, 정밀검토 C10) · 작업지시서 §25-6-80.
- 판 6.1 · sw 캐시명 v6.1.2 · 계산 · 인쇄 · MM-PRINT 구간 · 사용자 매뉴얼 변경 없음.

## v6.1.1 (2026-11-12) — 건물개요 저장 · 불러오기

- 공통 원본 MM-PROJECT v1.2 새로 넣음(🏢 건물개요 단추 — 같은 현장 정보를 다른 MANMIN 도구와 주고받음). 공유 칸: 사업명 · 작성자. 이미 입력된 칸은 직접 체크해야 덮어씀(정밀검토 B6 · 작업지시서 §25-6-77).
- 판 6.1 · sw `duct-v6.1.1` · 계산 · 인쇄 · MM-PRINT 구간 · 사용자 매뉴얼 변경 없음.

> 기계설비 기술기준 (국토교통부 고시 제2021-851호 · 제2026-360호 타법개정, 2026.7.8. 시행) 별표 9 기반  
> 공조 풍량에 따른 덕트 규격 자동 산정 **PWA**

---

## v6.1.0 (2026-11-12) — 기준 표기 · 판 6.1

- 별표 9 「1.3 타 규정과의 관계」 목록에 **KCS 31 20 20 덕트설비공사 표준시방서** 추가(화면 · 계산서 2곳), A4 계산서 압력 구분 출처 「별표 9 표 1 · KCS 31 20 20 표 3.2-1」(정밀검토 B13 · 기계설비 기술기준 제2026-360호 원문 LawMCP 2026-11-12 확인)
- 판 표기 Ver-6.1 · sw `duct-v6.1.0` · 계산 변경 없음 · 사용자 매뉴얼은 종전 판 그대로

## 🌐 라이브 데모
**https://manminkim-eng.github.io/Air-Conditioning-Duct/**  
📘 사용자 매뉴얼 : https://manminkim-eng.github.io/Air-Conditioning-Duct/manual/

---

## ✨ 기능

| 기능 | 설명 |
|---|---|
| 단일 덕트 산정 | 사각 / 원형 / 편평 덕트 규격 자동 산정 |
| 다중 덕트 산정 | 여러 구간 일괄 계산 |
| 설계 기준표 | 풍속 · 마찰손실 참고표 |
| A4 미리보기 | ISO A4 산정서 인쇄 / JPG 저장 |
| 모바일 미리보기 | SNS 공유용 결과 카드 |
| **PWA 설치** | 홈 화면 설치 · 오프라인 동작 |

---

## 📲 PWA 설치

### Android / Chrome
- 접속 후 하단 **"지금 설치"** 배너 클릭
- 또는 헤더 **📲 설치** 버튼 클릭

### iOS / Safari
- Safari 접속 → 공유(□↑) → **"홈 화면에 추가"**

---

## 📁 파일 구조

```
├── index.html                    # 메인 앱 (PWA 적용)
├── manifest.json                 # PWA 매니페스트
├── sw.js                         # Service Worker
├── .nojekyll                     # GitHub Pages Jekyll 비활성
├── README.md
└── icons/
    ├── icon-72x72.png  ~  icon-512x512.png   (9종)
    ├── icon-192x192-maskable.png              (Android 적응형)
    ├── icon-512x512-maskable.png              (Android 적응형)
    ├── apple-touch-icon.png                   (iOS)
    ├── favicon.ico
    ├── favicon-16x16.png
    └── favicon-32x32.png
```

---

## 🚀 GitHub Pages 배포

```bash
git init
git add .
git commit -m "feat: MANMIN 덕트산정 PWA 배포"
git remote add origin https://github.com/[유저명]/[저장소].git
git push -u origin main
```
→ GitHub **Settings → Pages → Source: main / root** 선택

---

## 📐 적용 기준
- 기계설비법 법률 제17453호 (2020.06.09)
- 기계설비 기술기준 국토교통부 고시 제2021-851호 (제2026-360호 타법개정, 2026.7.8. 시행)
- 별표 9 덕트설비 — 판두께 표 2 · 표 4 · 풍속 상한 표 1(저압 15 · 고압 20 m/s) · 장단비 4:1 이내(2.1(1))
- 관련 기준 KDS 31 25 30 · KDS 31 25 20 · KCS 31 25 20 (별표 9 1.3)

---

> 본 산정 결과는 참고용이며, 최종 설계는 담당 엔지니어 책임 하에 확인하시기 바랍니다.  
> **ENGINEER KIM MANMIN**
