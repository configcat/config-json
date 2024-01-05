/**
 * The ConfigCat config_v6.json schema that is used by the ConfigCat SDKs, described using TypeScript types.
 */
declare namespace ConfigCat.ConfigJson {
  type Config = {
    /**
     * Preferences of the config.json, mostly for controlling the redirection behaviour of the SDK.
     */
    p: Preferences;
    /**
     * Segment definitions for re-using segment rules in targeting rules.
     */
    s?: Segment[];
    /**
     * Setting definitions.
     */
    f?: { [key: string]: SettingUnion };
  }

  type Preferences = {
    /**
     * The redirect mode that should be used in case the data governance mode is wrongly configured.
     */
    r: RedirectMode;
    /**
     * The base url from where the config.json is intended to be downloaded.
     */
    u: string;
    /**
     * The salt that, combined with the feature flag key or segment name, is used to hash values for sensitive text comparisons.
     */
    s: string;
  }

  type Segment = {
    n: string;
    r: [UserConditionUnion, ...UserConditionUnion[]];
  }

  type SettingUnion = { [K in SettingType]: Setting<K> }[SettingType];

  type Setting<TSetting extends SettingType = SettingType> = {
    t: TSetting;
    /**
     * The percentage rule evaluation will hash this attribute of the User object to calculate the buckets.
     */
    a?: string;
    r?: TargetingRule<TSetting>[];
    p?: PercentageOption<TSetting>[];
  } & ServedValue<TSetting>;

  type TargetingRule<TSetting extends SettingType = SettingType> = {
    c: [ConditionUnion, ...ConditionUnion[]];
  } & (
    { s: ServedValue<TSetting>, p?: never } 
    | { p: PercentageOption<TSetting>[], s?: never }
  )

  type ConditionUnion =
    { u: UserConditionUnion, p?: never, s?: never }
    | { p: PrerequisiteFlagCondition, u?: never, s?: never } 
    | { s: SegmentCondition, u?: never, p?: never }

  type PercentageOption<TSetting extends SettingType = SettingType> = {
    p: number;
  } & ServedValue<TSetting>;

  type SettingValue<TSetting extends SettingType = SettingType> = {
    [SettingType.Boolean]: { b: boolean, s?: never, i?: never, d?: never };
    [SettingType.String]: { s: string, b?: never, i?: never, d?: never };
    [SettingType.Int]: { i: number, b?: never, s?: never, d?: never };
    [SettingType.Double]: { d: number, b?: never, s?: never, i?: never };
  }[TSetting];

  type UserConditionUnion = { [K in UserComparator]: UserCondition<K> }[UserComparator];

  type UserCondition<TComparator extends UserComparator = UserComparator> = {
    /**
     * The attribute of the user object that should be used to evalaute this rule.
     */
    a: string;
    c: TComparator;
  } & UserConditionComparisonValue<TComparator>

  type UserConditionComparisonValue<TComparator extends UserComparator = UserComparator> = {
    [UserComparator.IsOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.IsNotOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.ContainsAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.NotContainsAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.SemVerIsOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.SemVerIsNotOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.SemVerLess]: UserConditionStringComparisonValue;
    [UserComparator.SemVerLessOrEquals]: UserConditionStringComparisonValue;
    [UserComparator.SemVerGreater]: UserConditionStringComparisonValue;
    [UserComparator.SemVerGreaterOrEquals]: UserConditionStringComparisonValue;
    [UserComparator.NumberEquals]: UserConditionNumberComparisonValue;
    [UserComparator.NumberNotEquals]: UserConditionNumberComparisonValue;
    [UserComparator.NumberLess]: UserConditionNumberComparisonValue;
    [UserComparator.NumberLessOrEquals]: UserConditionNumberComparisonValue;
    [UserComparator.NumberGreater]: UserConditionNumberComparisonValue;
    [UserComparator.NumberGreaterOrEquals]: UserConditionNumberComparisonValue;
    [UserComparator.SensitiveIsOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveIsNotOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.DateTimeBefore]: UserConditionNumberComparisonValue;
    [UserComparator.DateTimeAfter]: UserConditionNumberComparisonValue;
    [UserComparator.SensitiveTextEquals]: UserConditionStringComparisonValue;
    [UserComparator.SensitiveTextNotEquals]: UserConditionStringComparisonValue;
    [UserComparator.SensitiveTextStartsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveTextNotStartsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveTextEndsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveTextNotEndsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveArrayContainsAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveArrayNotContainsAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextEquals]: UserConditionStringComparisonValue;
    [UserComparator.TextNotEquals]: UserConditionStringComparisonValue;
    [UserComparator.TextStartsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextNotStartsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextEndsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextNotEndsWithAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.ArrayContainsAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.ArrayNotContainsAnyOf]: UserConditionStringListComparisonValue;
  }[TComparator];

  type UserConditionStringComparisonValue = { s: string, d?: never, l?: never };
  type UserConditionNumberComparisonValue = { d: number, s?: never, l?: never };
  type UserConditionStringListComparisonValue = { l: string[], s?: never, d?: never };
  
  type PrerequisiteFlagCondition = {
    /**
     * The key of the prerequisite flag.
     */
    f: string;
    c: PrerequisiteFlagComparator;
    v: SettingValue;
  }

  type SegmentCondition = {
    /**
     * The zero-based index of the segment.
     */
    s: number;
    c: SegmentComparator ;
  }

  type ServedValue<TSetting extends SettingType = SettingType> = {
    v: SettingValue<TSetting>;
    i: string;
  }

  const enum RedirectMode {
    No = 0,
    Should = 1,
    Force = 2,
  }

  const enum SettingType {
    Boolean = 0,
    String = 1,
    Int = 2,
    Double = 3,
  }

  const enum UserComparator {
    IsOneOf = 0,
    IsNotOneOf = 1,
    ContainsAnyOf = 2,
    NotContainsAnyOf = 3,
    SemVerIsOneOf = 4,
    SemVerIsNotOneOf = 5,
    SemVerLess = 6,
    SemVerLessOrEquals = 7,
    SemVerGreater = 8,
    SemVerGreaterOrEquals = 9,
    NumberEquals = 10,
    NumberNotEquals = 11,
    NumberLess = 12,
    NumberLessOrEquals = 13,
    NumberGreater = 14,
    NumberGreaterOrEquals = 15,
    SensitiveIsOneOf = 16,
    SensitiveIsNotOneOf = 17,
    DateTimeBefore = 18,
    DateTimeAfter = 19,
    SensitiveTextEquals = 20,
    SensitiveTextNotEquals = 21,
    SensitiveTextStartsWithAnyOf = 22,
    SensitiveTextNotStartsWithAnyOf = 23,
    SensitiveTextEndsWithAnyOf = 24,
    SensitiveTextNotEndsWithAnyOf = 25,
    SensitiveArrayContainsAnyOf = 26,
    SensitiveArrayNotContainsAnyOf = 27,
    TextEquals = 28,
    TextNotEquals = 29,
    TextStartsWithAnyOf = 30,
    TextNotStartsWithAnyOf = 31,
    TextEndsWithAnyOf = 32,
    TextNotEndsWithAnyOf = 33,
    ArrayContainsAnyOf = 34,
    ArrayNotContainsAnyOf = 35,
  }

  const enum PrerequisiteFlagComparator {
    Equals = 0,
    NotEquals = 1
  }

  const enum SegmentComparator {
    IsIn = 0,
    IsNotIn = 1,
  }
}
