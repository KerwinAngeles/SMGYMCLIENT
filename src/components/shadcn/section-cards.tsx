import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { getAllMemberships } from "@/features/memberships/services/membershipService"
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

async function getMembershipData(): Promise<Membership[]> {
  const response = await getAllMemberships();
  return response;
}

async function getStatisticsData(): Promise<
  {
    currentClients: number,
    previousClients: number,
    growthRateClient: number,
    totalClient: number,
    activeClients: number,
    inactiveClients: number,
    suspendedClients: number
  } | null> {
  const response = await getClientsStatistics();
  return response;
}


export function SectionCards() {
  const [membershipData, setMembershipData] = useState<Membership[]>([])
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

  const loadGrowthData = async () => {
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

  const revenue = useMemo(() => {
    return membershipData.filter(m => m.statusName === "Active").reduce((sum, m) => sum + m.planPrice, 0)
  }, [membershipData])

  useEffect(() => {
    LoadMembershipData()
    loadGrowthData()
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
          <CardDescription>Total Customers</CardDescription>
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
            Total registered customers in the platform
          </div>
          <div className="text-muted-foreground">
            The community keeps growing 
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {statisticsData?.activeClients ?? '...'}
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
            Users are active and happy
          </div>
          <div className="text-muted-foreground">The community keeps growing </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            4.5%
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
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
