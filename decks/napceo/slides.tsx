import {
  Slide, Heading, GradientText, Badge, Text, Split, Card, Grid, Stack, Row,
  Animate, CountUp, Stagger, StatBox, IconCircle, Chart, Pipeline, Spacer,
  DataTable, GhostNumber, Divider,
} from '@slidemason/primitives';
import {
  Moon, TrendingUp, Users, Zap, Brain, DollarSign, Target,
  BarChart3, Shield, Rocket, Crown, BedDouble, Sparkles,
  PieChart, AlertTriangle, Award, Building2, Star, ArrowUpRight,
} from 'lucide-react';

const slides = [
  /* ── 1. Title ── */
  <Slide key="s1" layout="center" bg="mesh">
    <Animate effect="scale">
      <Moon size={48} style={{ color: 'var(--sm-primary)' }} />
    </Animate>
    <Spacer size="sm" />
    <Badge>SEED ROUND · 2026</Badge>
    <Spacer size="sm" />
    <GradientText size="hero">NapCEO</GradientText>
    <Text muted style={{ fontSize: 'clamp(0.9rem, 2cqi, 1.3rem)' }}>
      The Executive Nap Management Platform
    </Text>
    <Spacer size="md" />
    <Text size="sm" muted>Synergizing rest and innovation.</Text>
    <Spacer size="lg" />
    <Text size="sm" muted>Presented by Eric Kittelson</Text>
    <Spacer size="xl" />
    <Text size="xs" muted>Confidential — NapCEO Inc.</Text>
  </Slide>,

  /* ── 2. The Problem ── */
  <Slide key="s2" layout="free">
    <GhostNumber n={1} />
    <Badge>THE PROBLEM</Badge>
    <Heading size="hero">The napping industry is broken.</Heading>
    <Spacer size="sm" />
    <Stagger effect="fade-up">
      <Card pad="sm">
        <Row gap="sm">
          <IconCircle icon={AlertTriangle} size="sm" />
          <Stack gap="xs">
            <Text size="sm" className="font-semibold">Zero nap accountability</Text>
            <Text size="xs" muted>73% of workers nap with no KPIs, no sprint planning, and no retrospectives.</Text>
          </Stack>
        </Row>
      </Card>
      <Card pad="sm">
        <Row gap="sm">
          <IconCircle icon={BarChart3} size="sm" />
          <Stack gap="xs">
            <Text size="sm" className="font-semibold">Nap debt is an untracked liability</Text>
            <Text size="xs" muted>Companies report revenue, headcount, and burn rate — but not a single line item for nap debt.</Text>
          </Stack>
        </Row>
      </Card>
      <Card pad="sm">
        <Row gap="sm">
          <IconCircle icon={Users} size="sm" />
          <Stack gap="xs">
            <Text size="sm" className="font-semibold">No peer benchmarking</Text>
            <Text size="xs" muted>How do you know if you're a top-quartile napper? You don't. That ends today.</Text>
          </Stack>
        </Row>
      </Card>
    </Stagger>
  </Slide>,

  /* ── 3. Market Size ── */
  <Slide key="s3" layout="free">
    <GhostNumber n={2} />
    <Badge>MARKET OPPORTUNITY</Badge>
    <Spacer size="sm" />
    <Heading size="hero">A $432B market with zero disruption.</Heading>
    <Spacer size="lg" />
    <Grid cols={3} gap="lg">
      <Animate effect="fade-up">
        <Card pad="lg">
          <Stack gap="sm" style={{ textAlign: 'center' }}>
            <Text size="sm" muted>TAM</Text>
            <GradientText size="lg">$432B</GradientText>
            <Text size="sm" muted>Global sleep economy</Text>
          </Stack>
        </Card>
      </Animate>
      <Animate effect="fade-up">
        <Card pad="lg">
          <Stack gap="sm" style={{ textAlign: 'center' }}>
            <Text size="sm" muted>SAM</Text>
            <GradientText size="lg">$28B</GradientText>
            <Text size="sm" muted>Enterprise nap segment</Text>
          </Stack>
        </Card>
      </Animate>
      <Animate effect="fade-up">
        <Card pad="lg">
          <Stack gap="sm" style={{ textAlign: 'center' }}>
            <Text size="sm" muted>SOM</Text>
            <GradientText size="lg">$847M</GradientText>
            <Text size="sm" muted>Gamified nap management</Text>
          </Stack>
        </Card>
      </Animate>
    </Grid>
    <Spacer size="md" />
    <Text size="xs" muted style={{ textAlign: 'center' }}>Source: McKinsey Global Napping Report (2026). Numbers may have been generated during a nap.</Text>
  </Slide>,

  /* ── 4. The Solution ── */
  <Slide key="s4" layout="free">
    <GhostNumber n={3} />
    <Badge>THE SOLUTION</Badge>
    <Heading size="lg">Agile methodology for unconsciousness.</Heading>
    <Text size="sm" muted>We treat your naps like a Fortune 500 company treats quarterly earnings.</Text>
    <Spacer size="sm" />
    <Grid cols={2} gap="sm">
      <Stagger effect="fade-up">
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={PieChart} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Nap Portfolio Management</Text>
              <Text size="xs" muted>Track nap assets across categories. Candlestick charts included.</Text>
            </Stack>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={DollarSign} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Sleep Equity (SLP) Tokens</Text>
              <Text size="xs" muted>Earn tokens for napping. Vest over 4 years. Trade on NapExchange.</Text>
            </Stack>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={Crown} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Title Progression System</Text>
              <Text size="xs" muted>Nap Intern to Chief Nap Officer. 10,000 lifetime minutes to unlock CNO.</Text>
            </Stack>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={Rocket} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">IPO Your Nap Schedule</Text>
              <Text size="xs" muted>Go public. Let investors bet on your napping potential.</Text>
            </Stack>
          </Row>
        </Card>
      </Stagger>
    </Grid>
  </Slide>,

  /* ── 5. Nap Portfolio ── */
  <Slide key="s5" layout="free">
    <Badge>PRODUCT DEEP DIVE</Badge>
    <Spacer size="sm" />
    <Heading>The Nap Portfolio</Heading>
    <Spacer size="sm" />
    <Text muted>Enterprise-grade nap categorization for the modern professional.</Text>
    <Spacer size="md" />
    <DataTable
      headers={['Nap Class', 'Duration', 'Risk Profile', 'Expected ROI']}
      rows={[
        ['Power Nap', '15 min', 'Low risk, high liquidity', '+23% alertness'],
        ['Strategic Siesta', '30 min', 'Moderate risk, steady returns', '+41% creativity'],
        ['Executive Recharge', '45 min', 'Growth asset, volatile', '+67% decision quality'],
        ['Board-Level Blackout', '60+ min', 'High risk, high reward', '+∞ vibes'],
      ]}
      highlight={[3]}
    />
  </Slide>,

  /* ── 6. Title Progression ── */
  <Slide key="s6" layout="free">
    <Badge>GAMIFICATION</Badge>
    <Spacer size="sm" />
    <Heading>The Corporate Nap Ladder</Heading>
    <Spacer size="sm" />
    <Text muted>Every great napper started as an intern.</Text>
    <Spacer size="lg" />
    <Pipeline
      items={[
        { icon: Star, label: 'Nap Intern', sub: '0 min' },
        { icon: ArrowUpRight, label: 'Associate', sub: '500 min' },
        { icon: TrendingUp, label: 'Senior', sub: '2,000 min' },
        { icon: Target, label: 'VP', sub: '5,000 min' },
        { icon: Crown, label: 'CNO', sub: '10,000 min' },
      ]}
    />
    <Spacer size="lg" />
    <Card>
      <Row gap="md">
        <Award size={28} style={{ color: 'var(--sm-accent)', flexShrink: 0 }} />
        <Text size="sm" muted>CNO title holders can IPO their nap schedule, unlock "Earnings Call ASMR" sleep sounds, and receive a physical pillow embroidered with their NapCEO stock ticker.</Text>
      </Row>
    </Card>
  </Slide>,

  /* ── 7. Metrics ── */
  <Slide key="s7" layout="free">
    <Badge>TRACTION</Badge>
    <Heading size="lg">Metrics that matter.</Heading>
    <Spacer size="sm" />
    <Grid cols={2} gap="sm">
      <Animate effect="fade-up">
        <StatBox value="47,200" label="Daily Active Unconsciousness" icon={BedDouble} />
      </Animate>
      <Animate effect="fade-up">
        <StatBox value="94" label="Nap Promoter Score" icon={TrendingUp} />
      </Animate>
      <Animate effect="fade-up">
        <StatBox value="$2.1M" label="Annual Recurring Rest" icon={DollarSign} />
      </Animate>
      <Animate effect="fade-up">
        <StatBox value="$0.43" label="Cost of Acquiring Consciousness" icon={Brain} />
      </Animate>
    </Grid>
    <Spacer size="sm" />
    <Text size="xs" muted style={{ textAlign: 'center' }}>LTV:CAC ratio of 847:1. Investors, please remain calm.</Text>
  </Slide>,

  /* ── 8. Growth Chart ── */
  <Slide key="s8" layout="free">
    <Badge>GROWTH</Badge>
    <Spacer size="sm" />
    <Heading>Hockey stick, but horizontal.</Heading>
    <Spacer size="sm" />
    <Text muted>Because we're lying down.</Text>
    <Spacer size="md" />
    <Chart
      type="area"
      data={[
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 340 },
        { month: 'Mar', users: 890 },
        { month: 'Apr', users: 2100 },
        { month: 'May', users: 5800 },
        { month: 'Jun', users: 12400 },
        { month: 'Jul', users: 23100 },
        { month: 'Aug', users: 47200 },
      ]}
      xKey="month"
      series={['users']}
      showAxes
    />
    <Spacer size="sm" />
    <Text size="sm" muted style={{ textAlign: 'center' }}>DAU growth since launch. 393x in 8 months. Most of them are actually sleeping.</Text>
  </Slide>,

  /* ── 9. Business Model ── */
  <Slide key="s9" layout="free">
    <Badge>BUSINESS MODEL</Badge>
    <Heading size="lg">Three tiers. One dream.</Heading>
    <Spacer size="sm" />
    <Grid cols={3} gap="sm">
      <Stagger effect="fade-up">
        <Card pad="sm">
          <Stack gap="xs" style={{ textAlign: 'center' }}>
            <BedDouble size={24} style={{ color: 'var(--sm-muted)', margin: '0 auto' }} />
            <Text size="sm" className="font-bold">Free</Text>
            <Divider />
            <Text size="xs" muted>Track up to 3 naps/day</Text>
            <Text size="xs" muted>Basic nap portfolio</Text>
            <Text size="xs" muted>Title: Nap Intern (forever)</Text>
          </Stack>
        </Card>
        <Card pad="sm">
          <Stack gap="xs" style={{ textAlign: 'center' }}>
            <Moon size={24} style={{ color: 'var(--sm-primary)', margin: '0 auto' }} />
            <Text size="sm" className="font-bold">Pro — $9.99/mo</Text>
            <Divider />
            <Text size="xs" muted>Unlimited naps</Text>
            <Text size="xs" muted>AI nap coaching</Text>
            <Text size="xs" muted>Sleep sounds: "VC Pitch ASMR"</Text>
            <Text size="xs" muted>Title progression unlocked</Text>
          </Stack>
        </Card>
        <Card pad="sm">
          <Stack gap="xs" style={{ textAlign: 'center' }}>
            <Building2 size={24} style={{ color: 'var(--sm-accent)', margin: '0 auto' }} />
            <Text size="sm" className="font-bold">Enterprise — $49/seat</Text>
            <Divider />
            <Text size="xs" muted>Team nap analytics</Text>
            <Text size="xs" muted>Org-wide nap OKRs</Text>
            <Text size="xs" muted>Slack: "Eric is in a Sprint Nap"</Text>
            <Text size="xs" muted>Nap IPO eligibility</Text>
          </Stack>
        </Card>
      </Stagger>
    </Grid>
  </Slide>,

  /* ── 10. Competitive Landscape ── */
  <Slide key="s10" layout="free">
    <Badge>COMPETITION</Badge>
    <Spacer size="sm" />
    <Heading>Competitive Landscape</Heading>
    <Spacer size="md" />
    <DataTable
      headers={['Competitor', 'Nap Gamification', 'Sleep Equity', 'IPO Feature', 'Vibes']}
      rows={[
        ['Sleep Cycle', 'None', 'None', 'None', 'Clinical'],
        ['Headspace', 'None', 'None', 'None', 'Zen'],
        ['Calm', 'None', 'None', 'None', 'Soothing'],
        ['A Literal Pillow', 'None', 'None', 'None', 'Perfect UX'],
        ['NapCEO', 'Full suite', 'SLP tokens', 'Yes', 'Immaculate'],
      ]}
      highlight={[4]}
    />
    <Spacer size="md" />
    <Card>
      <Text size="sm" muted>Our strongest competitor is "a literal pillow." Zero tech debt. Infinite battery life. No loading screens. We respect the pillow. But the pillow doesn't have candlestick charts.</Text>
    </Card>
  </Slide>,

  /* ── 11. Unit Economics ── */
  <Slide key="s11" layout="free">
    <Badge>UNIT ECONOMICS</Badge>
    <Heading>The numbers don't sleep.</Heading>
    <Spacer size="sm" />
    <Grid cols={3} gap="sm">
      <StatBox value="$364" label="LTV — Lifetime Total Zzz's" icon={DollarSign} />
      <StatBox value="$0.43" label="CAC" icon={Target} />
      <StatBox value="847:1" label="LTV:CAC Ratio" icon={TrendingUp} />
    </Grid>
    <Spacer size="sm" />
    <Grid cols={2} gap="sm">
      <Card pad="sm">
        <Stack gap="xs">
          <Text size="sm" className="font-semibold">Why is CAC so low?</Text>
          <Text size="xs" muted>Our users literally talk about us in their sleep. Word of mouth costs nothing when the mouth is unconscious.</Text>
        </Stack>
      </Card>
      <Card pad="sm">
        <Stack gap="xs">
          <Text size="sm" className="font-semibold">Payback period</Text>
          <Text size="xs" muted>1.3 naps. The fastest payback in SaaS history. Most users are profitable before they wake up.</Text>
        </Stack>
      </Card>
    </Grid>
  </Slide>,

  /* ── 12. Slack Integration ── */
  <Slide key="s12" layout="free">
    <Badge>ENTERPRISE FEATURE</Badge>
    <Spacer size="sm" />
    <Heading>Nap Standup Meetings</Heading>
    <Spacer size="sm" />
    <Text muted>30-second daily summaries. Accountability for the unconscious.</Text>
    <Spacer size="lg" />
    <Stack gap="md">
      <Card>
        <Stack gap="xs">
          <Row gap="sm">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sm-bg)' }}>EK</span>
            </div>
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Eric Kittelson</Text>
              <Text size="xs" muted>VP of Unconsciousness · 2:07 PM</Text>
            </Stack>
          </Row>
          <Text size="sm" style={{ paddingLeft: '44px' }}>Executed a 23-min power nap at 14:07. Sleep efficiency: 87%. REM achieved: Yes. Blockers: neighbor's dog, existential dread. Sprint velocity: 1.4 naps/day. On track for quarterly nap OKRs.</Text>
        </Stack>
      </Card>
      <Card>
        <Stack gap="xs">
          <Row gap="sm">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sm-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sm-bg)' }}>JD</span>
            </div>
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Jane Doe</Text>
              <Text size="xs" muted>Senior Napper · 2:09 PM</Text>
            </Stack>
          </Row>
          <Text size="sm" style={{ paddingLeft: '44px' }}>Attempted a strategic siesta but was blocked by a 3pm meeting. Filed a nap impediment. Requesting async nap window from engineering. Rolling 7-day nap average: declining. Morale: low.</Text>
        </Stack>
      </Card>
    </Stack>
  </Slide>,

  /* ── 13. Team ── */
  <Slide key="s13" layout="free">
    <Badge>TEAM</Badge>
    <Heading size="lg">World-class nappers.</Heading>
    <Spacer size="sm" />
    <Grid cols={2} gap="sm">
      <Stagger effect="fade-up">
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={Brain} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">CEO & Founder</Text>
              <Text size="xs" muted>Former McKinsey. Fell asleep in a client meeting. Had the idea. Got fired. Started NapCEO.</Text>
            </Stack>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={Zap} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">CTO</Text>
              <Text size="xs" muted>Built a sleep tracker that became sentient and demanded PTO. Pivoted to NapCEO.</Text>
            </Stack>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={Shield} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Head of Nap Science</Text>
              <Text size="xs" muted>PhD in Horizontal Thinking. Published 12 papers on competitive sleeping.</Text>
            </Stack>
          </Row>
        </Card>
        <Card pad="sm">
          <Row gap="sm">
            <IconCircle icon={Sparkles} size="sm" />
            <Stack gap="xs">
              <Text size="sm" className="font-semibold">Chief Vibes Officer</Text>
              <Text size="xs" muted>Top-decile REM cycles. Once slept through a fire alarm and still hit OKRs.</Text>
            </Stack>
          </Row>
        </Card>
      </Stagger>
    </Grid>
  </Slide>,

  /* ── 14. The Ask ── */
  <Slide key="s14" layout="center">
    <GhostNumber n="$" />
    <Badge>THE ASK</Badge>
    <Spacer size="sm" />
    <Heading size="hero">$4.2M Seed Round</Heading>
    <Text muted style={{ fontSize: 'clamp(0.9rem, 2cqi, 1.3rem)' }}>$42M pre-money valuation</Text>
    <Spacer size="lg" />
    <Grid cols={3} gap="lg">
      <Animate effect="fade-up">
        <Card pad="lg">
          <Stack gap="sm" style={{ textAlign: 'center' }}>
            <Text className="font-bold" style={{ fontSize: 'clamp(1.25rem, 3cqi, 2rem)' }}>40%</Text>
            <Text size="sm" muted>Engineering</Text>
            <Text size="xs" muted>Build the NapExchange and IPO infrastructure</Text>
          </Stack>
        </Card>
      </Animate>
      <Animate effect="fade-up">
        <Card pad="lg">
          <Stack gap="sm" style={{ textAlign: 'center' }}>
            <Text className="font-bold" style={{ fontSize: 'clamp(1.25rem, 3cqi, 2rem)' }}>35%</Text>
            <Text size="sm" muted>Growth</Text>
            <Text size="xs" muted>Nap influencer partnerships and pillow-based guerrilla marketing</Text>
          </Stack>
        </Card>
      </Animate>
      <Animate effect="fade-up">
        <Card pad="lg">
          <Stack gap="sm" style={{ textAlign: 'center' }}>
            <Text className="font-bold" style={{ fontSize: 'clamp(1.25rem, 3cqi, 2rem)' }}>25%</Text>
            <Text size="sm" muted>Nap R&D</Text>
            <Text size="xs" muted>Advanced nap science, mattress partnerships, and dream analytics</Text>
          </Stack>
        </Card>
      </Animate>
    </Grid>
    <Spacer size="lg" />
    <Text size="sm" muted>18 months of runway at current burn rate. 24 months if we nap more efficiently.</Text>
  </Slide>,

  /* ── 15. Closing ── */
  <Slide key="s15" layout="center" bg="mesh">
    <Animate effect="scale">
      <Moon size={56} style={{ color: 'var(--sm-primary)' }} />
    </Animate>
    <Spacer size="md" />
    <GradientText size="hero">Invest in rest.</GradientText>
    <Spacer size="sm" />
    <Text muted style={{ fontSize: 'clamp(0.9rem, 2cqi, 1.3rem)' }}>The best returns come when you're asleep.</Text>
    <Spacer size="xl" />
    <Stack gap="xs">
      <Text size="sm" muted>eric@napceo.io</Text>
      <Text size="sm" muted>napceo.io</Text>
    </Stack>
    <Spacer size="lg" />
    <Text size="xs" muted>Confidential — NapCEO Inc.</Text>
  </Slide>,
];

export default slides;
