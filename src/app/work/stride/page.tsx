import type { Metadata } from "next";
import {
  Artifact,
  Beat,
  CaseHero,
  Hindsight,
  NextCase,
  Outcome,
  Tldr,
} from "@/components/case/CaseLayout";
import { LearningPrompt } from "@/components/work/stride/LearningPrompt";
import { PivotDiagram } from "@/components/work/stride/PivotDiagram";
import { TrackProgress } from "@/components/work/stride/TrackProgress";
import { FoundingDesignerGrid } from "@/components/work/stride/FoundingDesignerGrid";
import { Shot } from "@/components/work/stride/Shot";
import { InsightsToStrategy, MvpScorecard, TwoReasons, WhatsWrong } from "@/components/work/stride/Findings";
import { JourneyMap, PhasedOnboarding } from "@/components/work/stride/Onboarding";

export const metadata: Metadata = {
  title: "Three times the product was wrong",
  description:
    "Five years as co-founder and founding product designer at Stride: a B2B pivot, a phased onboarding, and the microlearning product that finally sold.",
};

export default function Page() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Stride · 2020–2025"
        title="Three times the product was wrong"
        lede="Five years as co-founder and founding product designer at a seed-stage coaching startup, told as three times the product was wrong and what I did each time: a pivot that found the customer, an onboarding that fixed the first week, and a microlearning product that finally sold."
        meta={[
          { label: "Role", value: "Co-founder and founding product designer" },
          { label: "Team", value: "CEO, technical and business co-founders, product. Coaches on contract." },
          { label: "Timeline", value: "2020 to 2025" },
          { label: "Outcome", value: "1 to 20 clients, $750K seed round" },
        ]}
        artifact={<LearningPrompt />}
      />

      <Tldr
        items={[
          "Stride put professional coaching inside Slack and Microsoft Teams for small and mid-size companies.",
          "I was co-founder and founding product designer for five years. Three product bets were mine, and each one moved a number.",
          "Pivoting from a standalone B2C workspace to a B2B integration brought in the first ten enterprise clients.",
          "A phased onboarding raised first-week usage 36%. Development Journey Tracks took monthly active users from 2% to 22% of seats and became the feature that closed and kept clients.",
        ]}
      />

      {/* Chapter 1 */}
      <Beat
        chapter="Chapter 1 · Finding the customer"
        title="The first product"
        artifact={
          <Artifact label="The original dashboard" pill="Screenshot">
            <Shot
              src="/work/stride/userDashboard-before.png"
              alt="The first Stride web dashboard: a welcome banner with weekly goal counts, a Goals list, and an Achievements list, with a Talk to a Coach button in the header"
              width={1510}
              height={1175}
              caption="A Stride-owned Slack workspace, plus this goals tracker. Individuals signed up and came to us."
            />
          </Artifact>
        }
      >
        <p>
          Stride started with a question: how do you make coaching part of someone&apos;s working day
          instead of an appointment they have to leave it for? Our first answer was a Stride-owned
          Slack workspace and a personal dashboard for goals and sessions. Individuals signed up and
          came to us.
        </p>
      </Beat>

      <Beat
        title="Nobody came"
        reverse
        artifact={
          <Artifact label="What the interviews said" pill="Paraphrased">
            <TwoReasons />
          </Artifact>
        }
      >
        <p>
          Usage was low. Interviews with the users we did have gave two reasons. Leaving your own
          workspace to reach a coach was friction nobody tolerated, and the people who understood
          coaching&apos;s value weren&apos;t individual contributors. They were managers, VPs of People,
          and Chief People Officers, who saw it as a lever for their teams and held the budget.
        </p>
      </Beat>

      <Beat
        title="Go where they already are"
        artifact={
          <Artifact label="B2C to B2B" pill="Diagram">
            <PivotDiagram />
          </Artifact>
        }
      >
        <p>
          We pivoted to B2B. I read the Slack and Teams app documentation to find out what an
          in-platform integration could do, then designed one a company installs in its own workspace:
          text-based live coaching in a DM, with video for deeper conversations. The first ten
          enterprise clients came in on that feature.
        </p>
      </Beat>

      {/* Chapter 2 */}
      <Beat
        chapter="Chapter 2 · Fixing the first week"
        title="Confusion at the door"
        artifact={
          <Artifact label="The first-week journey" pill="Before">
            <JourneyMap />
          </Artifact>
        }
      >
        <p>
          Once companies were installing Stride, usage in the first week was weak. People didn&apos;t
          know what Stride was, what to ask, or when to use it. The journey started before the app
          did: our CEO would brief a people leader, who emailed their team. I designed the co-branded
          emails and collateral so the first impression was set before anyone opened Slack.
        </p>
      </Beat>

      <Beat
        title="A disagreement, and a better answer"
        reverse
        artifact={
          <Artifact label="Phased onboarding" pill="Mock data">
            <PhasedOnboarding />
          </Artifact>
        }
      >
        <p>
          Inside the app, I pushed for one comprehensive onboarding message to kill the confusion
          directly. A co-founder pushed back: too much up front, and people drop. We were both right,
          so we phased it, a light welcome and then guidance over the first several days. First-week
          usage went up 36%.
        </p>
      </Beat>

      {/* Chapter 3 */}
      <Beat
        chapter="Chapter 3 · Finding the thing that sold"
        title="Engagement, the business problem"
        artifact={
          <Artifact label="Who low engagement hurt">
            <WhatsWrong />
          </Artifact>
        }
      >
        <p>
          Weekly engagement stayed low, and it was a business problem, not a design problem. Sales
          couldn&apos;t demonstrate value. Client relations couldn&apos;t retain or upsell on the
          numbers. Users were paying for coaching they&apos;d forgotten they had.
        </p>
      </Beat>

      <Beat
        title="Research, then a hypothesis with metrics attached"
        reverse
        artifact={
          <Artifact label="Insights to strategy">
            <InsightsToStrategy />
          </Artifact>
        }
      >
        <p>
          I ran text-based interviews in Slack after sessions and read coach-recorded session data.
          Three findings: users forgot the platform existed, didn&apos;t know what to bring to a coach,
          and didn&apos;t see how coaching applied to their job. I set two metrics before designing
          anything: weekly engagement, with a goal of 10% over baseline, and platform utility,
          measured through post-session surveys.
        </p>
      </Beat>

      <Beat
        title="The MVP hit its number and still failed"
        artifact={
          <Artifact label="The MVP message" pill="Shipped">
            <Shot
              src="/work/stride/learningPrompt-before-1.png"
              alt="A Stride Slack message from the MVP: a bold tip reading Create trust by giving feedback often, two lines of plain text, and an italic nudge, with no video, visual, or feedback buttons"
              width={1046}
              height={276}
            />
            <div className="mt-3">
              <MvpScorecard />
            </div>
          </Artifact>
        }
      >
        <p>
          The MVP was automated weekly messages built on a learn-apply-reflect model and split by
          role: make your deliverables SMART for ICs, hold a stay interview for managers. Engagement
          rose 9%, within a point of the goal. But users dropped off after two weeks, satisfaction
          didn&apos;t move, and the feedback was consistent: it&apos;s generic. Hitting the metric
          wasn&apos;t the same as working.
        </p>
      </Beat>

      <Beat
        title="Development Journey Tracks"
        reverse
        artifact={
          <Artifact label="One track, one user" pill="Mock data">
            <TrackProgress />
          </Artifact>
        }
      >
        <p>
          I redesigned in three weeks. Instead of generic tips, twenty topic-based tracks, each a
          structured path: 23 micro-learnings over three months, Tuesdays and Thursdays. Topics came
          from users and from client people leaders, so each track mapped to something a company had
          said it cared about. The co-founder who ran our coaching practice wrote the content; I built
          the message structure and the cadence.
        </p>
      </Beat>

      <Beat
        title="The message, rebuilt"
        artifact={
          <Artifact label="A learning, as shipped" pill="Screenshot">
            <Shot
              src="/work/stride/learningPrompt-after-1.png"
              alt="A redesigned Stride Slack message: a question-style title about why change is harder for some, two short paragraphs, a Short Video button, a Stages of Change visual, a Learning 2 of 24 label, and thumbs up and thumbs down buttons asking Was this learning helpful"
              width={1046}
              height={1071}
              caption="The real message. The interactive version at the top of this page is a recreation with mock content."
            />
          </Artifact>
        }
      >
        <p>
          I translated each learning into the Slack format: a short video, a visual, one numbered
          takeaway, and a feedback prompt. The numbering mattered more than I expected. Seeing where
          you were on a path gave a reason to open the next one, and a thumbs up or down gave us a
          signal per message instead of waiting for a survey.
        </p>
      </Beat>

      <Outcome
        stats={[
          { value: "2% → 22%", label: "monthly active users, of seats" },
          { value: "+18%", label: "user satisfaction" },
          { value: "+36%", label: "first-week usage, after the phased onboarding" },
          { value: "1 → 20", label: "clients over five years" },
        ]}
      >
        <p>
          Coaches reported users arriving at sessions prepared. Tracks became the feature that closed
          and kept clients, because a people leader could point to skills that mapped to their
          business.
        </p>
        <p>
          The seat base was small, so I weigh the change in the sales conversation as heavily as the
          percentage. Our technical co-founder pulled the usage numbers.
        </p>
      </Outcome>

      <Beat
        title="Everything else a founding designer does"
        artifact={
          <Artifact label="The other hats" pill="2020–2025">
            <FoundingDesignerGrid />
          </Artifact>
        }
      >
        <p>
          Over five years I also owned the brand, the marketing site through three redesigns, every
          sales deck, social, product videos, and the onboarding and drip email for users and
          prospects. For the seed round I made the collateral the founders took into the room: deck,
          visuals, prototype, and a product video. None of it is the story, but all of it was the job.
        </p>
      </Beat>

      <Hindsight>
        <p>
          I was talking to buyers and users from the start, but I didn&apos;t yet have the product
          sense to turn what I heard into a position, so the roadmap followed our sales-focused
          CEO&apos;s pipeline. I&apos;d have pushed for product-led signals earlier: structured
          questions in interviews, and working with our technical co-founder on dashboard metrics I
          could actually use. When Tracks landed, the sales conversation changed on its own. I&apos;d
          have wanted that two years sooner.
        </p>
      </Hindsight>

      <NextCase slug="rcs-studio" />
    </div>
  );
}
