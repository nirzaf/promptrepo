import { getAllUsers } from "@/db/queries/admin";
import { updateUserRole, banUser, unbanUser, deleteUser } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, UserX, UserCheck, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const users = await getAllUsers(1, 100);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">User</th>
                                    <th className="text-left p-2">Email</th>
                                    <th className="text-left p-2">Role</th>
                                    <th className="text-left p-2">Status</th>
                                    <th className="text-left p-2">Joined</th>
                                    <th className="text-right p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-muted/50">
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                {user.image && (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || "User"}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{user.name || "Anonymous"}</div>
                                                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-2 text-sm">{user.email}</td>
                                        <td className="p-2">
                                            <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="p-2">
                                            {user.isVerified ? (
                                                <Badge variant="default">Active</Badge>
                                            ) : (
                                                <Badge variant="outline">Banned</Badge>
                                            )}
                                        </td>
                                        <td className="p-2 text-sm">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="p-2">
                                            <div className="flex gap-1 justify-end">
                                                <UserActionButtons user={user} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function UserActionButtons({ user }: { user: any }) {
    return (
        <>
            {user.isVerified ? (
                <form action={banUser.bind(null, user.id)}>
                    <Button type="submit" variant="ghost" size="sm" title="Ban User">
                        <UserX className="w-4 h-4" />
                    </Button>
                </form>
            ) : (
                <form action={unbanUser.bind(null, user.id)}>
                    <Button type="submit" variant="ghost" size="sm" title="Unban User">
                        <UserCheck className="w-4 h-4" />
                    </Button>
                </form>
            )}
            <form action={deleteUser.bind(null, user.id)}>
                <Button type="submit" variant="ghost" size="sm" title="Delete User">
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            </form>
        </>
    );
}
