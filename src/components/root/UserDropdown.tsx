import { BookOpenIcon, HomeIcon, LeafIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignOut } from "@/hooks/use-sign-out";
import GeneratedAvatar from "../generated-avatar";
import { Skeleton } from "../ui/skeleton";
import { IconDashboard } from "@tabler/icons-react";
import { useLocale } from "next-intl";

interface UserDropdownProps {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  isLoading?: boolean;
}

// Loading skeleton component
export function UserDropdownSkeleton() {
  return (
    <Button variant="ghost" size="lg" className="hover:bg-transparent" disabled>
      <Skeleton className="size-9 rounded-full" />
    </Button>
  );
}

export default function UserDropdown({
  name,
  email,
  image,
  isLoading,
}: UserDropdownProps) {
  const handleSignOut = useSignOut();
  const locale = useLocale();

  if (isLoading) {
    return <UserDropdownSkeleton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-10 rounded-full hover:bg-transparent"
        >
          {image ? (
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>
                <GeneratedAvatar
                  seed={name as string}
                  variant="botttsneutral"
                />
              </AvatarFallback>
            </Avatar>
          ) : (
            <GeneratedAvatar seed={name as string} variant="initials" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name || "User"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email || "User Email"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>{locale === "fr" ? "Accueil" : "Home"}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
              <LeafIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>{locale === "fr" ? "Séances" : "Sessions"}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <IconDashboard
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{locale === "fr" ? "Gestionnaire" : "Dashboard"}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{locale === "fr" ? "Se Déconnecter" : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
