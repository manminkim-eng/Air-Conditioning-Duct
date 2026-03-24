# 💨 공조 덕트 규격 산정 시스템 [MANMIN-Ver2.0]

> 기계설비 기술기준 (국토교통부 고시 제2021-851호) 별표 9 기반  
> 공조 풍량에 따른 덕트 규격 자동 산정 **PWA**

---

## 🌐 라이브 데모
**https://[your-username].github.io/[repo-name]/**

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
- 기계설비 기술기준 국토교통부 고시 제2021-851호
- 별표 9 덕트설비의 설계 및 시공 기준

---

> 본 산정 결과는 참고용이며, 최종 설계는 담당 엔지니어 책임 하에 확인하시기 바랍니다.  
> **ENGINEER KIM MANMIN**
