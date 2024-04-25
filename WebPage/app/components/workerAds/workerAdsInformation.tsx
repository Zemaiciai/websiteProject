export default function workerAdsInformation() {
  return (
    <ul className="space-y-4 text-back list-disc list-inside ">
      <li>
        Reklamos pavadinimas
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>
            Reklamos pavadinimą turi sudaryti bent 5 simboliai ir nedaugiau 50.
          </li>
        </ul>
      </li>
      <li>
        Grupės aprašymas
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>
            Grupės aprašymas yra skirtas tiksliai papasakoti apie jūsų teikiamas
            paslaugas, kokią patirtį turite, nurodyti darbų pavyzdžius ir t.t.
          </li>
          <li>Reklamos aprašymą turi sudaryti bent 100 simbolių.</li>
        </ul>
      </li>
      <li>
        Bendra reklamų informacija
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>Vienas vartotojas gali turėti tik 2 reklamas.</li>
          <li>
            Reklamos pavadinimas ir aprašymas turi būti aprašytas formalia
            kalba.
          </li>
          <li>Vienoje reklamoje gali būti tik 3 YouTube nuorodos.</li>
        </ul>
      </li>
    </ul>
  );
}
