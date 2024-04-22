import { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
export const meta: MetaFunction = () => [
  { title: "Kontraktas baigėsi - Žemaičiai" },
];
const BanPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white-background ">
      <div className="bg-custom-800 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          Jūsų kontraktas{" "}
          <span className="text-yellow-500">baigė galioti!</span>
        </h2>
        <p className="mb-4">
          Susisiekite su mumis, kad pratęstume jūsų paskiros galiojimą!
        </p>

        <Form action="/logout" method="post">
          <button type="submit" className="text-white underline">
            Atsijungti!
          </button>
        </Form>
      </div>
    </div>
  );
};

export default BanPage;
