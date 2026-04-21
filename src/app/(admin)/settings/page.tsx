import { requireAdmin } from "@/lib/auth/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type IntegrationStatus = {
  name: string;
  description: string;
  envVar: string;
  required: boolean;
};

const integrations: IntegrationStatus[] = [
  { name: "Database (Neon PostgreSQL)", description: "Primary application datastore.", envVar: "DATABASE_URL", required: true },
  { name: "NextAuth", description: "Session signing secret for authentication.", envVar: "NEXTAUTH_SECRET", required: true },
  { name: "Anthropic Claude", description: "Generates reports and SEO fix suggestions.", envVar: "ANTHROPIC_API_KEY", required: true },
  { name: "Resend (Email)", description: "Transactional email — invoices, magic links, reminders.", envVar: "RESEND_API_KEY", required: true },
  { name: "Cron secret", description: "Protects scheduled cron endpoints.", envVar: "CRON_SECRET", required: true },
  { name: "Ahrefs", description: "Third-party SEO data provider.", envVar: "AHREFS_API_KEY", required: false },
  { name: "Semrush", description: "Third-party SEO data provider.", envVar: "SEMRUSH_API_KEY", required: false },
  { name: "Shopify", description: "Ecommerce storefront sync (integration pending).", envVar: "SHOPIFY_API_KEY", required: false },
  { name: "WordPress bridge", description: "Shared secret for WordPress plugin callbacks (integration pending).", envVar: "WORDPRESS_BRIDGE_SECRET", required: false },
];

const cronJobs = [
  { name: "SEO scan", schedule: "Daily at 02:00 UTC", path: "/api/cron/seo-scan" },
  { name: "Renewal check", schedule: "Daily at 03:00 UTC", path: "/api/cron/renewal-check" },
  { name: "Post verification", schedule: "Every 6 hours", path: "/api/cron/post-verification" },
  { name: "Invoice reminders", schedule: "Daily at 08:00 UTC", path: "/api/cron/invoice-reminders" },
  { name: "Monthly reports", schedule: "1st of month at 01:00 UTC", path: "/api/cron/monthly-reports" },
];

export default async function SettingsPage() {
  const session = await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">System configuration and integration status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>Signed-in admin profile</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{session.user.name || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{session.user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{String(session.user.role).replace("_", " ")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Configured via environment variables. Values are never displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {integrations.map((item) => {
            const configured = Boolean(process.env[item.envVar]);
            return (
              <div key={item.envVar} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <code className="text-xs text-muted-foreground">{item.envVar}</code>
                </div>
                {configured ? (
                  <Badge variant="default">Configured</Badge>
                ) : item.required ? (
                  <Badge variant="destructive">Missing</Badge>
                ) : (
                  <Badge variant="secondary">Not set</Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled jobs</CardTitle>
          <CardDescription>Cron endpoints defined in render.yaml</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {cronJobs.map((job) => (
            <div key={job.path} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium">{job.name}</p>
                <code className="text-xs text-muted-foreground">{job.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{job.schedule}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shopify & WordPress</CardTitle>
          <CardDescription>
            Integration modules will plug in here.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Shopify store connections and WordPress bridge configuration are not wired up yet.
            When the integration code lands, its settings UI will render in this section.
          </p>
          <Separator />
          <p>
            WordPress per-site credentials are already managed on each blog record under
            <span className="font-mono"> /admin/blogs</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
