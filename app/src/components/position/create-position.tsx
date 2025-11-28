import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import FormPosition from "./form-position";

interface CreatePositionProps {
  token: string;
  onPositionCreated: () => void;
}

export default function CreatePosition({
  token,
  onPositionCreated,
}: CreatePositionProps) {
  const [modalCreate, setModalCreate] = useState(false);

  const handlerModal = () => setModalCreate(true);
  const handlerClose = () => setModalCreate(false);

  return (
    <div className="pt-10 sm:pt-0">
      <Button onClick={handlerModal} className="text-white">
        <Plus className="mr-1" /> Agregar Puesto
      </Button>

      {modalCreate && (
        <FormPosition
          handlerClose={handlerClose}
          token={token}
          onSuccess={onPositionCreated}
        />
      )}
    </div>
  );
}
