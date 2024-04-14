export default function groupsCreationInformation() {
  return (
    <ul className="space-y-4 text-back list-disc list-inside ">
      <li>
        Grupės pavadinimas
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>
            Grupės pavadinimą turi sudaryti bent 5 simboliai ir nedaugiau 20.
          </li>
          <li>Grupės pavadinimas turi būti unikalus.</li>
        </ul>
      </li>
      <li>
        Grupės apibūdinimas
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>
            Grupės apibūdinimas skirtas suteiktu vartotojui trumpą aprašyma apie
            jūsų grupę kurį jie ras visų grupių saraše.
          </li>
          <li>
            Grupės aprašymą turi sudaryti bent 10 simbolių ir nedaugiau kaip N.
          </li>
        </ul>
      </li>
      <li>
        Grupės aprašymas
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>
            Grupės aprašymas yra skirtas tiksliai papasakoti apie jūsų grupę, ką
            jūs sugebate, kokias paslaugas teikiate ir t.t.
          </li>
          <li>Grupės aprašymą turi sudaryti bent 100 simbolių.</li>
        </ul>
      </li>
      <li>
        Bendra grupių informacija
        <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
          <li>Narius pakviesti į grupę galėsite tik sukūrę grupę.</li>
          <li>
            Taip pat kai kviesite narius galėsite nustatyti kiek procentų pinigų
            už atliktą darbą gaus vartotojas.
          </li>
          <li>
            Grupės pavadinimas ir abu aprašymai turi būti aprašyti formalia
            kalba.
          </li>
          <li>
            Grupės nariam galite priskirti roles, apie kurias bus plačiau
            aprašyta, rolių keitimo puslapyje.
          </li>
        </ul>
      </li>
    </ul>
  );
}
