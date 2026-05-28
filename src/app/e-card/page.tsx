import ECardGenerator from "@/components/e-card/ECardGenerator";

export default function ECardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 font-outfit">ඩිජිටල් වෙසක් සුබපැතුම් පත්</h1>
        <p className="text-secondary/60 max-w-2xl mx-auto">
          ඔබේ ආදරණීයයන් වෙත වෙසක් සුබපැතුම් පතක් යැවීමට දැන් ඉතා පහසුයි. නම ඇතුළත් කර, Template එකක් තෝරා, එය Download කරගන්න.
        </p>
      </div>

      <ECardGenerator />
    </div>
  );
}
