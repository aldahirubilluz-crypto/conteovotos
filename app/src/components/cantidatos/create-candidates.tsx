"use client";

import { Plus, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function CreateCandidates() {
  const [modalUser, setModalUser] = useState(false);
  const [modalPosition, setModalPosition] = useState(false);

  const handlerPosition = () => {
    setModalUser(true);
    console.log("Crear puesto");
  };

  const handlerUser = () => {
    setModalPosition(true);
    console.log("Crear candidato");
  };

  return (
    <div className="flex w-full gap-4">
      <Button className="bg-primary" onClick={handlerPosition}>
        <Plus className="mr-2" /> Crear Puesto
      </Button>

      <Button className="bg-primary" onClick={handlerUser}>
        <UserPlus className="mr-2" /> Crear Candidato
      </Button>
    </div>
  );
}
