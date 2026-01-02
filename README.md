
# MedTrack (Türkçe) 🏥

MedTrack, React Native ve Expo ile geliştirilmiş kapsamlı bir kişisel sağlık yönetimi uygulamasıdır. Kullanıcıların ilaçlarını, sağlık ölçümlerini takip etmelerine ve tıbbi rutinlerini aksatmamaları için önemli hatırlatıcılar kurmalarına yardımcı olur.

## 🌟 Temel Özellikler

- **İlaç Takibi:** İlaçlarınızı detaylı programlarla ekleyin ve yönetin.
- **Sağlık Ölçümleri:** Tansiyon, kan şekeri ve diğer hayati metrikleri kaydedin.
- **Hatırlatıcılar ve Bildirimler:** Dahili uyarılar sayesinde hiçbir dozu veya ölçümü kaçırmayın.
- **Görsel Analizler:** Sağlık verilerinizin trendlerini sezgisel grafiklerle görüntüleyin.
- **Yerel Depolama:** Verileriniz SQLite kullanılarak cihazınızda güvenli bir şekilde saklanır.
- **Çoklu Dil Desteği:** İngilizce ve Türkçe için tam yerelleştirme.

## 🛠 Teknoloji Yığını

- **Framework:** [React Native](https://reactnative.dev/) ve [Expo](https://expo.dev/)
- **Yönlendirme:** [Expo Router](https://docs.expo.dev/router/introduction/) (Dosya tabanlı)
- **Veritabanı:** [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Yerelleştirme:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **Grafikler:** [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)
- **Tasarım:** React Native StyleSheet ve Linear Gradients ile özel bileşenler.

## 🚀 Başlarken

1.  **Depoyu kopyalayın:**

    ```bash
    git clone <repository-url>
    cd medtrack-app
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Uygulamayı başlatın:**
    ```bash
    npx expo start
    ```

---

## 📁 Project Structure / Proje Yapısı

```text
/app         - Route handlers & screens (Expo Router)
/assets      - Images, fonts, and static assets
/src
  /components - Reusable UI components
  /constants  - App constants and theme
  /contexts   - React contexts (Language, Theme, etc.)
  /database   - SQLite setup and queries
  /hooks      - Custom React hooks
  /i18n       - Localization files (EN/TR)
  /services   - Notification and external services
  /styles     - Global styles and theme tokens
```

---

## 📄 License / Lisans

This project is private. All rights reserved. / Bu proje özeldir. Tüm hakları saklıdır.
