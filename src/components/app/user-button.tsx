"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserButton({
  name,
  email,
  role,
  image,
  compact = false,
}: {
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
  compact?: boolean;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await authClient.signOut();
    if (!result.error) {
      router.push("/login");
      router.refresh();
    }
  };

  const initials = getInitials(name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button className="cursor-pointer rounded-full">
            <Avatar>
              {image ? <AvatarImage src={image} alt={name} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        ) : (
        <button className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted">
          <Avatar>
            {image ? <AvatarImage src={image} alt={name} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">
              {role ?? ""}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent side={compact ? "bottom" : "right"} align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <Avatar>
            {image ? <AvatarImage src={image} alt={name} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm text-foreground">{name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">{role ?? ""}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/platform/account">
            <User />
            Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
