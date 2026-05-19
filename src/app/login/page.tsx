import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/layout/LinkButton";
import { Stack } from "@/components/layout/Stack";
import { TopNav } from "@/components/layout/TopNav";
import { Card } from "@/components/ui/Card";
import { MetaText } from "@/components/ui/MetaText";
import { Body } from "@/components/typography/Body";
import { Heading } from "@/components/typography/Heading";

export default function LoginPage() {
  return (
    <AppShell className="min-h-dvh bg-soft" topBar={<TopNav className="border-b border-hairline" />}>
      <Stack
        gap="section"
        align="center"
        justify="center"
        className="flex-1 px-6 py-16 anim-fade-in"
      >
        <Card variant="elevated" padding="lg" className="w-full max-w-md shadow-pop">
          <Stack gap="section" align="center">
            <Stack gap="cozy" align="center">
              <Heading size="h2">Section Source Pack</Heading>
              <Body size="body" tone="muted" className="text-center">
                Regulatory writing workspace for module narratives and section source packs
              </Body>
              <MetaText tone="faint" size="sm">
                Demo · continue as Jordan Lee
              </MetaText>
            </Stack>
            <LinkButton
              href="/submissions"
              variant="primary"
              size="md"
              className="w-full justify-center"
            >
              Continue as Medical Writer
            </LinkButton>
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}
