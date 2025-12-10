import { IconTrendingDown, IconTrendingUp, IconAlertCircle } from "@tabler/icons-react"
import { getAllMemberships } from "@/features/memberships/services/membershipService"
import { getMembershipAboutToExpire } from "@/features/dashboard/services/dashboardService"
import { getMembershipStatistics } from "@/features/dashboard/services/dashboardService"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getClientsStatistics } from "@/features/dashboard/services/dashboardService"
import { useEffect, useMemo, useState } from "react"
import type { Membership } from "@/features/memberships/types"
import type { ClientStatistics , MembershipStatistics} from "@/features/dashboard/types"


async function getMembershipData(): Promise<Membership[]> {
  const response = await getAllMemberships();
  console.log('total membership active ' + response)
  return response;
}

async function getTotalMembershipAboutToExpireData(): Promise<Membership[]> {
  const response = await getMembershipAboutToExpire();
  return response;
}

async function getStatisticsData(): Promise<ClientStatistics> {
  const response = await getClientsStatistics();
  return response;
}

async function getMembershipStatisticsData(): Promise<MembershipStatistics> {
  const response = await getMembershipStatistics();
  return response;
}


export function SectionCards() {
  const [membershipData, setMembershipData] = useState<Membership[]>([])
  const [totalMembershipAboutToExpire, setTotalMembershipAboutToExpire] = useState<number>();
  const [membershipStatistics, setMembershipStatistics] = useState<MembershipStatistics>();
  const [statisticsData, setStatisticsData] = useState<{
    currentClients: number
    previousClients: number
    growthRateClient: number
    totalClient: number
    activeClients: number
    inactiveClients: number
    suspendedClients: number
  } | null>(null)

  const [isLoading, setLoading] = useState(false)

  const LoadGrowthData = async () => {
    setLoading(true)
    try {
      const statistics = await getStatisticsData()
      console.log(statistics);
      setStatisticsData(statistics)
    } catch (error) {
      toast.error('Failed to load growth data')
    } finally {
      setLoading(false)
    }
  }

  const LoadMembershipStatistics = async () => {
    setLoading(true);
    try{
      const membershipStatistics = await getMembershipStatisticsData();
      setMembershipStatistics(membershipStatistics);
    }catch(error){
      toast.error('Failed to load membership statistics data');
    }finally{
      setLoading(false);
    }
  }

  const LoadMembershipData = async () => {
    setLoading(true)
    try {
      const memberships = await getMembershipData()
      setMembershipData(memberships.length ? memberships : [])
    } catch (error) {
      toast.error('Failed to load membership data')
    } finally {
      setLoading(false)
    }
  }

  const GetTotalMemberhipAboutToExpire = async () => {
    setLoading(true);
    try {
      const totalMembershipAboutToExpire = await getTotalMembershipAboutToExpireData();
      const response = totalMembershipAboutToExpire.length;
      setTotalMembershipAboutToExpire(response)
    } catch (error) {
      toast.error('Failed to load total membership about to expired data');
    } finally {
      setLoading(false)
    }
  }

  const revenue = useMemo(() => {
    return membershipData.filter(m => m.statusName === "Active").reduce((sum, m) => sum + m.planPrice, 0)
  }, [membershipData])

  useEffect(() => {
    LoadMembershipData();
    LoadMembershipStatistics();
    LoadGrowthData();
    GetTotalMemberhipAboutToExpire();
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            ${revenue}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total revenue from active memberships
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Members</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {statisticsData?.totalClient ?? '...'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              {statisticsData?.growthRateClient ?? '...'}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered members on the platform
          </div>
          <div className="text-muted-foreground">
            Overall members base performance
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription> Total Membership Active</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {membershipStatistics?.membershipActive}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Currently active memberships
          </div>
          <div className="text-muted-foreground">The community keeps growing </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Membership About to Expired</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {totalMembershipAboutToExpire}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Memberships approaching expiration <IconAlertCircle className="size-4" />
          </div>
          <div className="text-muted-foreground">Opportunity to renew and retain customers</div>
        </CardFooter>
      </Card>

    </div>
  )
}
