import { Signal, component$, useStylesScoped$ } from "@builder.io/qwik";

import styles from "./Template2.css?inline";
import {
  Certification,
  Education,
  Language,
  Position,
  Resume,
  SKill,
} from "../../../routes/cv/[id]/data";
interface Iprops {
  resume2: any;
  resume: Resume;
  ref: Signal<Element | undefined>;
}
export default component$(({ resume2, resume, ref }: Iprops) => {
  const { skillsData } = resume2 || {};
  useStylesScoped$(styles);

  return (
    <section class="container" ref={ref}>
      <div class="wrapper templateId2" id="cv">
        <table class="table_class header_table">
          <tbody>
            <tr>
              <td class="candidate_details">
                {resume.candidateDetails.FirstName === "" ? null : (
                  <h2 class="h2">
                    {resume.candidateDetails.FirstName.charAt(0).toUpperCase() +
                      "." || ""}
                  </h2>
                )}
                {resume.candidateDetails.LastName === "" ? null : (
                  <h2 class="h2">
                    {resume.candidateDetails.LastName.charAt(0).toUpperCase() +
                      "." || ""}
                  </h2>
                )}
                <h3 class="h3">{resume.candidateDetails.Role || ""}</h3>
                <h3
                  style={{
                    marginTop: "5px",
                    color: "#616a73",
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  {resume.candidateDetails.YearsOfExperience || ""}
                </h3>
                <br />
              </td>
              {/* <td class="logo">{<img height="28px" />}</td> */}
              <td class="logo">{<img />}</td>
            </tr>
          </tbody>
        </table>

        <hr class="horizontal_line" />

        <table class="table_class table_container">
          <tbody>
            <tr>
              <td class="leftpart">
                <table class="table_class">
                  <tbody>
                    {resume.skills.TopSkills.length !== 0 ? (
                      <>
                        <tr>
                          <th
                            class="th_title"
                            style={{ paddingBottom: "20px" }}
                          >
                            T O P &nbsp; S K I L L S
                          </th>
                        </tr>

                        <tr class="top_skills">
                          {resume.skills.TopSkills.map(
                            (topskill: any) => (
                              <td>
                                <table>
                                  <tbody>
                                    <tr>
                                      <td class="top_skills_value">
                                        {topskill.Name}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            )
                          )}
                        </tr>
                      </>
                    ) : null}
                    {resume.employementHistory.Position.length !== 0 ? (
                      <>
                        <tr>
                          <th class="th_title" style={{ paddingTop: "25px" }}>
                            E M P L O Y M E N T &nbsp; H I S T O R Y
                          </th>
                        </tr>
                        {resume.employementHistory.Position.map(
                          (position: Position, index: any) => {
                            return (
                              <tr>
                                <td>
                                  <table
                                    key={index}
                                    class="table_class"
                                    style={{ width: "90%" }}
                                  >
                                    <tbody>
                                      <tr>
                                        <th class="heading">
                                          {position.PositionTitle}
                                        </th>
                                      </tr>
                                      <tr>
                                        <td class="employer_name">
                                          {position.CompanyName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td class="employment_duration">
                                          {position.StartDate +
                                            " - " +
                                            position.EndDate}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <div class="employment_history">
                                            {position.Description}
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    ) : null}

                    {resume.educationHistory.Education.length !== 0 ? (
                      <>
                        <tr class="tr_title">
                          <th class="th_title">E D U C A T I O N</th>
                        </tr>
                        {resume.educationHistory.Education.map(
                          (edu: Education, index: any) => {
                            return (
                              <tr>
                                <td>
                                  <table key={index}>
                                    <tbody>
                                      <tr>
                                        <th class="heading">
                                          {edu.Degree || ""}
                                        </th>
                                      </tr>
                                      <tr>
                                        <td class="employer_name">
                                          {edu.School || ""}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td class="edu_duration">
                                          {edu.StartDate +
                                            " " +
                                            edu.EndDate +
                                            " " +
                                            edu.City}{" "}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    ) : null}
                  </tbody>
                </table>
              </td>
              <td class="rightpart">
                <table
                  class="table_class"
                  style={{ backgroundColor: "#FBFBFB", padding: "0 10px 10px" }}
                >
                  <tbody>
                    <tr>
                      <td>
                        {skillsData.length !== 0 ? (
                          <table class="other_skills table_class">
                            <tbody>
                              <tr class="tr_title">
                                <th class="th_title">
                                  O T H E R &nbsp; S K I L L S
                                </th>
                              </tr>
                              {skillsData.map((skillgroup: any, index: any) => (
                                <tr>
                                  <td>
                                    <table key={index} class="table_class">
                                      <tbody>
                                        <ul class="top_skills_table_ul ul_class">
                                          {resume.skills.TopSkills.map(
                                            (topskill: SKill, index: any) => (
                                              <li
                                                key={index}
                                                class="top_skills_table_li li_class"
                                              >
                                                {topskill.Name}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : null}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {resume.languages.Language.length !== 0 ? (
                          <table class="table_class">
                            <tbody>
                              <tr>
                                <th class="th_title">L A N G U A G E S</th>
                              </tr>
                              {resume.languages.Language.map(
                                (lang: Language, index: any) => (
                                  <tr>
                                    <td>
                                      <table key={index}>
                                        <tbody>
                                          <tr>
                                            <th class="heading">{lang.Name}</th>
                                          </tr>
                                          <tr>
                                            {lang.Name === "" ? null : (
                                              <td class="rightpart_text">
                                                {lang.Level}
                                              </td>
                                            )}
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        ) : null}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        {resume.certifications.Certification.length !== 0 ? (
                          <table class="table_class">
                            <tbody>
                              <tr>
                                <th class="th_title">
                                  C E R T I F I C A T I O N S
                                </th>
                              </tr>
                              {resume.certifications.Certification.map(
                                (certif: Certification, index: any) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <table class="table_class">
                                          <tbody>
                                            <tr>
                                              <th class="heading" lang="en">
                                                {certif.Name}
                                              </th>
                                            </tr>

                                            {certif.Date}
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
});
