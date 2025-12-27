"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useFirebase } from "@/firebase"
import { Loader2, ShieldCheck, Users, Globe, Mail, Github, Facebook, UserCircle } from "lucide-react"

// تعريب مزودي الخدمة بأسماء تليق بالأكاديمية
const availableProviders = [
    { id: 'password', name: 'البريد الإلكتروني وكلمة السر', icon: Mail },
    { id: 'google.com', name: 'حساب جوجل الملكي', icon: Globe },
    { id: 'facebook.com', name: 'فيسبوك', icon: Facebook },
    { id: 'github.com', name: 'جيت هاب للمطورين', icon: Github },
    { id: 'anonymous', name: 'دخول الزوار (مجهول)', icon: UserCircle },
]

export default function AuthenticationPage() {
    const { auth, isUserLoading } = useFirebase();

    if (isUserLoading) {
        return (
            <div className="flex h-[60vh] justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
            </div>
        );
    }
    
    // هذه الإعدادات المفعلة حالياً في مملكتكِ
    const enabledProviders = ['password', 'google.com', 'anonymous'];

    return (
        <div className="space-y-8 p-6 animate-in fade-in duration-500">
            {/* قسم إدارة بوابات الدخول */}
            <Card className="border-amber-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-amber-700" />
                        <CardTitle className="text-2xl font-bold text-amber-900">بوابات العبور الملكية</CardTitle>
                    </div>
                    <CardDescription className="text-amber-800/70 italic">
                        قم بتحديد طرق الدخول المسموح بها لطلاب الأكاديمية.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {availableProviders.map(provider => (
                            <div key={provider.id} className="flex items-center justify-between rounded-xl border border-amber-100 p-4 bg-white hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <provider.icon className={`h-5 w-5 ${enabledProviders.includes(provider.id) ? 'text-amber-600' : 'text-gray-400'}`} />
                                    <span className="font-medium text-gray-800">{provider.name}</span>
                                </div>
                                <Switch 
                                    checked={enabledProviders.includes(provider.id)} 
                                    aria-label={`تفعيل ${provider.name}`}
                                    className="data-[state=checked]:bg-amber-600"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* قسم إدارة الرعايا (المستخدمين) */}
            <Card className="border-gray-200 overflow-hidden">
                <CardHeader className="bg-gray-50">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-gray-700" />
                        <CardTitle className="text-xl">سجل الرعايا والطلاب</CardTitle>
                    </div>
                    <CardDescription>
                        إدارة بيانات الطلاب تتطلب صلاحيات الوزير (الآدمن) - قيد التطوير.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="p-4 bg-amber-50 rounded-full">
                           <Users className="h-12 w-12 text-amber-200" />
                        </div>
                        <p className="text-center text-muted-foreground max-w-sm">
                            حفاظاً على سرية بيانات المملكة، يتم إدارة قوائم المستخدمين عبر لوحة التحكم المركزية (Firebase Console) حتى اكتمال بناء نظام الإدارة الداخلي.
                        </p>
                        <Badge variant="outline" className="border-amber-500 text-amber-700 px-4 py-1">
                            قريباً: نظام الأوسمة الملكية للطلاب
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
