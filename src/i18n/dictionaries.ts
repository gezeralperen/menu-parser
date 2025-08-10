import type { LanguageCode } from "@/lib/languages";

import type { DeepPartial, Dictionary } from "@/types/i18n";
import { EN_BASE } from "./base";

// Start with English as the base
export const LOCALES: Partial<Record<LanguageCode, DeepPartial<Dictionary>>> = {
  en: EN_BASE, // full base

  tr: {
    common: {
      appTitle: "Uçak İçi Menü Asistanı",
      poweredByAi: "Yapay Zeka Destekli",
    },
    language: {
      chooseLanguage: "Dil Seçin",
      subtitle:
        "Sizinle en iyi bildiğiniz dilde konuşacağız. Daha sonra Ayarlar’dan değiştirebilirsiniz.",
      searchPlaceholder: "Dilinizin adını yazın veya bulun…",
      continue: "Devam Et →",
    },
    scan: {
      title: "Basılı Menüyü Tara",
      subtitle: "Kameranızı menü metnine doğrultun.",
      takePhoto: "Fotoğraf Çek",
      confirmTitle: "Bu fotoğraf uygun mu?",
      confirmLine1: "Tüm yazılar okunabiliyor ve menünün tamamı kadrajda mı?",
      confirmLine2: "Değilse, işlemden önce lütfen tekrar fotoğraf çekin.",
      confirmCta: "Evet, iyi görünüyor",
      retake: "Tekrar Çek",
      processing: "İşleniyor…",
      readySoon: "Menünüz birkaç saniye içinde hazır olacak.",
      permissionAllow: "Kameraya izin ver",
      permissionDeny: "Şimdi değil",
      lightingWarning: "İpucu: Daha iyi sonuç için aydınlık bir yere geçin.",
      unreadableWarning: "Yazılar zor okunuyor. Daha yakına gelin.",
    },
  },

  ar: {
    common: {
      appTitle: "مساعد قائمة الطائرة",
      poweredByAi: "مدعوم بالذكاء الاصطناعي",
    },
    language: {
      chooseLanguage: "اختر لغتك",
      subtitle:
        "سوف نتحدث معك بلغتك المفضلة. يمكنك تغييرها لاحقاً من الإعدادات.",
      searchPlaceholder: "اكتب أو ابحث عن لغتك…",
      continue: "متابعة →",
    },
    scan: {
      title: "مسح القائمة المطبوعة",
      subtitle: "وجّه الكاميرا نحو نص القائمة.",
      takePhoto: "التقط صورة",
      confirmTitle: "هل هذه الصورة صالحة؟",
      confirmLine1: "هل النص واضح والقائمة كاملة في الإطار؟",
      confirmLine2: "إذا لم يكن كذلك، يرجى إعادة التقاط الصورة قبل المعالجة.",
      confirmCta: "نعم، تبدو جيدة",
      retake: "إعادة الالتقاط",
      processing: "جارٍ المعالجة…",
      readySoon: "ستكون قائمتك جاهزة خلال ثوانٍ.",
      permissionAllow: "السماح للكاميرا",
      permissionDeny: "ليس الآن",
      lightingWarning:
        "نصيحة: انتقل إلى مكان أكثر إضاءة للحصول على أفضل النتائج.",
      unreadableWarning: "النص يبدو غير واضح. حاول الاقتراب أكثر.",
    },
  },

  ru: {
    common: {
      appTitle: "Бортовой помощник меню",
      poweredByAi: "Работает на ИИ",
    },
    language: {
      chooseLanguage: "Выберите язык",
      subtitle:
        "Мы будем говорить на вашем языке. Позже вы сможете изменить это в настройках.",
      searchPlaceholder: "Введите или найдите свой язык…",
      continue: "Продолжить →",
    },
    scan: {
      title: "Сканировать печатное меню",
      subtitle: "Направьте камеру на текст меню.",
      takePhoto: "Сделать фото",
      confirmTitle: "Это фото подходит?",
      confirmLine1: "Весь текст читаем и меню полностью в кадре?",
      confirmLine2: "Если нет, сделайте фото заново перед обработкой.",
      confirmCta: "Да, всё хорошо",
      retake: "Переснять",
      processing: "Обработка…",
      readySoon: "Ваше меню будет готово через несколько секунд.",
      permissionAllow: "Разрешить камеру",
      permissionDeny: "Не сейчас",
      lightingWarning:
        "Совет: Перейдите в более освещённое место для лучшего результата.",
      unreadableWarning: "Текст плохо читается. Подойдите ближе.",
    },
  },

  de: {
    common: {
      appTitle: "Bordmenü-Assistent",
      poweredByAi: "Unterstützt durch KI",
    },
    language: {
      chooseLanguage: "Sprache auswählen",
      subtitle:
        "Wir sprechen in der Sprache, die Sie am besten verstehen. Später können Sie dies in den Einstellungen ändern.",
      searchPlaceholder: "Geben Sie Ihre Sprache ein oder suchen Sie danach…",
      continue: "Weiter →",
    },
    scan: {
      title: "Gedrucktes Menü scannen",
      subtitle: "Richten Sie Ihre Kamera auf den Menüttext.",
      takePhoto: "Foto aufnehmen",
      confirmTitle: "Ist dieses Foto brauchbar?",
      confirmLine1: "Ist der gesamte Text lesbar und das ganze Menü im Bild?",
      confirmLine2:
        "Falls nicht, bitte machen Sie ein neues Foto, bevor wir es verarbeiten.",
      confirmCta: "Ja, sieht gut aus",
      retake: "Neu aufnehmen",
      processing: "Wird verarbeitet…",
      readySoon: "Ihr Menü ist in wenigen Sekunden bereit.",
      permissionAllow: "Kamera erlauben",
      permissionDeny: "Nicht jetzt",
      lightingWarning:
        "Tipp: Für beste Ergebnisse wechseln Sie zu besserem Licht.",
      unreadableWarning: "Text ist schwer zu lesen. Gehen Sie näher heran.",
    },
  },

  fr: {
    common: {
      appTitle: "Assistant du Menu à Bord",
      poweredByAi: "Propulsé par l'IA",
    },
    language: {
      chooseLanguage: "Choisissez votre langue",
      subtitle:
        "Nous parlerons dans la langue que vous connaissez le mieux. Vous pourrez changer cela plus tard dans les paramètres.",
      searchPlaceholder: "Tapez ou trouvez votre langue…",
      continue: "Continuer →",
    },
    scan: {
      title: "Scanner le menu imprimé",
      subtitle: "Pointez votre caméra vers le texte du menu.",
      takePhoto: "Prendre une photo",
      confirmTitle: "Cette photo est-elle utilisable ?",
      confirmLine1:
        "Tout le texte est-il lisible et le menu complet est-il dans le cadre ?",
      confirmLine2:
        "Si ce n’est pas le cas, veuillez reprendre la photo avant de la traiter.",
      confirmCta: "Oui, c’est bon",
      retake: "Reprendre",
      processing: "Traitement…",
      readySoon: "Votre menu sera prêt dans quelques secondes.",
      permissionAllow: "Autoriser la caméra",
      permissionDeny: "Pas maintenant",
      lightingWarning:
        "Astuce : déplacez-vous dans un endroit mieux éclairé pour de meilleurs résultats.",
      unreadableWarning: "Le texte semble difficile à lire. Approchez-vous.",
    },
  },

  it: {
    common: {
      appTitle: "Assistente del Menu a Bordo",
      poweredByAi: "Supportato dall'IA",
    },
    language: {
      chooseLanguage: "Scegli la tua lingua",
      subtitle:
        "Parleremo nella lingua che conosci meglio. Puoi cambiarla più tardi nelle Impostazioni.",
      searchPlaceholder: "Digita o trova la tua lingua…",
      continue: "Continua →",
    },
    scan: {
      title: "Scansiona il menu stampato",
      subtitle: "Punta la fotocamera verso il testo del menu.",
      takePhoto: "Scatta foto",
      confirmTitle: "Questa foto è utilizzabile?",
      confirmLine1:
        "Tutto il testo è leggibile e l’intero menu è nell’inquadratura?",
      confirmLine2:
        "In caso contrario, scatta di nuovo la foto prima dell’elaborazione.",
      confirmCta: "Sì, va bene",
      retake: "Scatta di nuovo",
      processing: "Elaborazione…",
      readySoon: "Il tuo menu sarà pronto in pochi secondi.",
      permissionAllow: "Consenti fotocamera",
      permissionDeny: "Non ora",
      lightingWarning:
        "Suggerimento: spostati in un luogo più illuminato per risultati migliori.",
      unreadableWarning:
        "Il testo sembra difficile da leggere. Avvicinati un po’.",
    },
  },

  es: {
    common: {
      appTitle: "Asistente de Menú a Bordo",
      poweredByAi: "Impulsado por IA",
    },
    language: {
      chooseLanguage: "Elige tu idioma",
      subtitle:
        "Hablaremos en el idioma que mejor conozcas. Puedes cambiarlo después en Configuración.",
      searchPlaceholder: "Escribe o busca tu idioma…",
      continue: "Continuar →",
    },
    scan: {
      title: "Escanear el menú impreso",
      subtitle: "Apunta la cámara al texto del menú.",
      takePhoto: "Tomar foto",
      confirmTitle: "¿Esta foto es útil?",
      confirmLine1:
        "¿Todo el texto es legible y el menú completo está dentro del encuadre?",
      confirmLine2: "Si no, vuelve a tomar la foto antes de procesarla.",
      confirmCta: "Sí, se ve bien",
      retake: "Volver a tomar",
      processing: "Procesando…",
      readySoon: "Tu menú estará listo en segundos.",
      permissionAllow: "Permitir cámara",
      permissionDeny: "Ahora no",
      lightingWarning:
        "Consejo: muévete a un lugar con mejor luz para mejores resultados.",
      unreadableWarning: "El texto parece difícil de leer. Acércate un poco.",
    },
  },

  fa: {
    common: {
      appTitle: "دستیار منوی پرواز",
      poweredByAi: "مجهز به هوش مصنوعی",
    },
    language: {
      chooseLanguage: "زبان خود را انتخاب کنید",
      subtitle:
        "ما به زبانی که بهتر می‌دانید صحبت می‌کنیم. بعداً می‌توانید از تنظیمات تغییر دهید.",
      searchPlaceholder: "زبان خود را تایپ یا پیدا کنید…",
      continue: "ادامه →",
    },
    scan: {
      title: "اسکن منوی چاپی",
      subtitle: "دوربین را به متن منو بگیرید.",
      takePhoto: "گرفتن عکس",
      confirmTitle: "آیا این عکس قابل استفاده است؟",
      confirmLine1: "آیا تمام متن خوانا است و کل منو در کادر قرار دارد؟",
      confirmLine2: "در غیر این صورت، قبل از پردازش دوباره عکس بگیرید.",
      confirmCta: "بله، خوب است",
      retake: "عکس مجدد",
      processing: "در حال پردازش…",
      readySoon: "منوی شما تا چند ثانیه دیگر آماده می‌شود.",
      permissionAllow: "اجازه دسترسی به دوربین",
      permissionDeny: "الان نه",
      lightingWarning: "نکته: برای نتیجه بهتر به محل پرنورتر بروید.",
      unreadableWarning: "متن خوانا نیست. کمی نزدیک‌تر شوید.",
    },
  },

  el: {
    common: {
      appTitle: "Βοηθός Μενού Πτήσης",
      poweredByAi: "Με τεχνητή νοημοσύνη",
    },
    language: {
      chooseLanguage: "Επιλέξτε γλώσσα",
      subtitle:
        "Θα μιλήσουμε στη γλώσσα που γνωρίζετε καλύτερα. Μπορείτε να την αλλάξετε αργότερα από τις Ρυθμίσεις.",
      searchPlaceholder: "Πληκτρολογήστε ή βρείτε τη γλώσσα σας…",
      continue: "Συνέχεια →",
    },
    scan: {
      title: "Σάρωση έντυπου μενού",
      subtitle: "Στρέψτε την κάμερα στο κείμενο του μενού.",
      takePhoto: "Λήψη φωτογραφίας",
      confirmTitle: "Είναι χρήσιμη αυτή η φωτογραφία;",
      confirmLine1:
        "Είναι όλο το κείμενο ευανάγνωστο και το μενού ολόκληρο στο κάδρο;",
      confirmLine2: "Αν όχι, τραβήξτε ξανά τη φωτογραφία πριν την επεξεργασία.",
      confirmCta: "Ναι, είναι εντάξει",
      retake: "Νέα λήψη",
      processing: "Γίνεται επεξεργασία…",
      readySoon: "Το μενού σας θα είναι έτοιμο σε λίγα δευτερόλεπτα.",
      permissionAllow: "Να επιτραπεί η κάμερα",
      permissionDeny: "Όχι τώρα",
      lightingWarning:
        "Συμβουλή: Μετακινηθείτε σε καλύτερο φωτισμό για καλύτερα αποτελέσματα.",
      unreadableWarning: "Το κείμενο φαίνεται δυσανάγνωστο. Πλησιάστε λίγο.",
    },
  },

  ja: {
    common: {
      appTitle: "機内メニューアシスタント",
      poweredByAi: "AI搭載",
    },
    language: {
      chooseLanguage: "言語を選択",
      subtitle: "最も慣れている言語で会話します。後で設定から変更できます。",
      searchPlaceholder: "言語を入力または検索…",
      continue: "続行 →",
    },
    scan: {
      title: "印刷されたメニューをスキャン",
      subtitle: "カメラをメニューの文字に向けてください。",
      takePhoto: "写真を撮る",
      confirmTitle: "この写真は使えますか？",
      confirmLine1:
        "すべての文字は読めますか？メニュー全体がフレームに入っていますか？",
      confirmLine2: "入っていない場合は、処理前に撮り直してください。",
      confirmCta: "はい、問題ありません",
      retake: "撮り直す",
      processing: "処理中…",
      readySoon: "数秒でメニューが準備できます。",
      permissionAllow: "カメラを許可",
      permissionDeny: "今はしない",
      lightingWarning: "ヒント：より明るい場所へ移動すると精度が上がります。",
      unreadableWarning: "文字が読みづらいようです。もう少し近づいてください。",
    },
  },
};

export type SupportedLocale = keyof typeof LOCALES;

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in LOCALES;
}
