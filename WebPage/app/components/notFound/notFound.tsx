export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen bg-white-background ">
      <div className="bg-custom-800 text-white rounded-lg p-12">
        <h2 className="text-2xl font-bold mb-4">
          Ooops, bandėte patekti į puslapį kuris{" "}
          <span className="text-red-500">neegzistuoja!</span>
        </h2>
        <a href="/dashboard" className="mb-4 underline">
          Grįžti į titulini!
        </a>
      </div>
    </div>
  );
}
