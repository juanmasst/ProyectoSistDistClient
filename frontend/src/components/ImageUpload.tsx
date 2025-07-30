import { useState } from "react";
import api from "../services/axios";
import Button from "./Button";

export default function ImageUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await api.post("/upload", formData);
      onUpload(data.url);
    } catch {
      setError("Error al subir la imagen");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover rounded"
        />
      )}
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Subiendo..." : "Subir Imagen"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
