import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LoginDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username.trim() || !password.trim()) {
			toast.error("Please fill in all fields");
			return;
		}

		setIsLoading(true);

		try {
			await login(username.trim(), password);
			toast.success("Login successful");
			onOpenChange(false);
			// Reset form
			setUsername("");
			setPassword("");
		} catch (error) {
			toast.error("Login failed", {
				description:
					error instanceof Error
						? error.message
						: "Please check your credentials",
				duration: 5000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			onOpenChange(false);
			// Reset form when closing
			setUsername("");
			setPassword("");
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px] max-h-[80vh] top-[10vh] sm:top-[50%] translate-y-0 sm:-translate-y-1/2">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						Sign In
					</DialogTitle>
					<DialogDescription className="text-center">
						Enter your credentials to access the bike fitting system
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<div className="relative">
							<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="username"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="pl-10"
								disabled={isLoading}
								autoComplete="username"
								autoCapitalize="none"
								autoCorrect="off"
								spellCheck="false"
								autoFocus
								enterKeyHint="next"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										document.getElementById("password")?.focus();
									}
								}}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="pl-10 pr-10"
								disabled={isLoading}
								autoComplete="current-password"
								autoCapitalize="none"
								autoCorrect="off"
								spellCheck="false"
								enterKeyHint="go"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										if (username.trim() && password.trim() && !isLoading) {
											handleSubmit(e as any);
										}
									}
								}}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								disabled={isLoading}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="sr-only">
									{showPassword ? "Hide password" : "Show password"}
								</span>
							</Button>
						</div>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isLoading}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !username.trim() || !password.trim()}
							className="flex-1"
						>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
