declare namespace ConfigCat.ConfigJson {
  /** The ConfigCat config_v6.json schema that is used by the ConfigCat SDKs, described using TypeScript types. */
  type Config = {
    /** Config-related preferences, mostly for controlling the redirection behaviour of the SDK. */
    p: Preferences;
    /** The array of segments that are used by segment conditions in targeting rules. */
    s?: Segment[];
    /** The key-value map of feature flags and settings. */
    f?: { [key: string]: SettingUnion };
  };

  /** Describes config-related preferences. */
  type Preferences = {
    /** The redirect mode that should be used in case the data governance mode is incorrectly configured. */
    r: RedirectMode;
    /** The base URL from which to download the config JSON. */
    u: string;
    /** The salt that, combined with the feature flag key or segment name, is used to hash values for sensitive text comparisons. */
    s: string;
  };

  /** Describes a segment. */
  type Segment = {
    /** The name of the segment. */
    n: string;
    /** The list of segment rule conditions (where there is a logical AND relation between the items). */
    r: [UserConditionUnion, ...UserConditionUnion[]];
  };

  type SettingUnion = { [K in SettingType]: Setting<K> }[SettingType];

  /** Describes a feature flag or setting. */
  type Setting<TSetting extends SettingType = SettingType> = {
    /** Setting type. */
    t: TSetting;
    /** The User Object attribute which serves as the basis of percentage options evaluation. */
    a?: string;
    /** The list of targeting rules (where there is a logical OR relation between the items). */
    r?: TargetingRule<TSetting>[];
    /** The list of percentage options. */
    p?: PercentageOption<TSetting>[];
  } & ServedValue<TSetting>;

  /** Describes a targeting rule. */
  type TargetingRule<TSetting extends SettingType = SettingType> = {
    /** The list of conditions that are combined with the AND logical operator. */
    c: [ConditionUnion, ...ConditionUnion[]];
  } & (
      {
        /** The list of percentage options associated with the targeting rule in case it has percentage options THEN part. */
        s: ServedValue<TSetting>;
        p?: never;
      }
      | {
        /** The simple value associated with the targeting rule in case it has a simple value THEN part. */
        p: PercentageOption<TSetting>[];
        s?: never;
      }
  );

  /** Contains one of the possible conditions. */
  type ConditionUnion =
    {
      /** A user condition. */
      u: UserConditionUnion;
      p?: never; s?: never;
    }
    | {
      /** A flag condition (prerequisite). */
      p: PrerequisiteFlagCondition;
      u?: never; s?: never;
    }
    | {
      /** A segment condition. */
      s: SegmentCondition;
      u?: never; p?: never;
    };

  /** Describes a percentage option. */
  type PercentageOption<TSetting extends SettingType = SettingType> = {
    /** A number between 0 and 100 that represents a randomly allocated fraction of the users. */
    p: number;
  } & ServedValue<TSetting>;

  /** Contains a value of one of the possible types. */
  type SettingValue<TSetting extends SettingType = SettingType> = {
    [SettingType.Boolean]: {
      /** A boolean value indicating the state of a feature flag (on/off toggle). */
      b: boolean;
      s?: never; i?: never; d?: never;
    };
    [SettingType.String]: {
      /** A string value representing the value of a text setting. */
      s: string;
      b?: never; i?: never; d?: never;
    };
    [SettingType.Int]: {
      /** An integer value representing the value of a whole number setting. */
      i: number;
      b?: never; s?: never; d?: never;
    };
    [SettingType.Double]: {
      /** A double value representing the value of a decimal number setting. */
      d: number;
      b?: never; s?: never; i?: never;
    };
  }[TSetting];

  type UserConditionUnion = { [K in UserComparator]: UserCondition<K> }[UserComparator];

  /** Describes a condition that is based on a User Object attribute. */
  type UserCondition<TComparator extends UserComparator = UserComparator> = {
    /** The User Object attribute that the condition is based on. Can be `Identifier`, `Email`, `Country` or any custom attribute. */
    a: string;
    /** The operator which defines the relation between the comparison attribute and the comparison value. */
    c: TComparator;
  } & UserConditionComparisonValue<TComparator>;

  type UserConditionComparisonValue<TComparator extends UserComparator = UserComparator> = {
    [UserComparator.TextIsOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextIsNotOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextContainsAnyOf]: UserConditionStringListComparisonValue;
    [UserComparator.TextNotContainsAnyOf]: UserConditionStringListComparisonValue;
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
    [UserComparator.SensitiveTextIsOneOf]: UserConditionStringListComparisonValue;
    [UserComparator.SensitiveTextIsNotOneOf]: UserConditionStringListComparisonValue;
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

  type UserConditionStringComparisonValue = {
    /** The string value that the User Object attribute is compared to in the case of specific text-based and SemVer-based comparisons. */
    s: string;
    d?: never; l?: never;
  };

  type UserConditionNumberComparisonValue = {
    /** The double value that the User Object attribute is compared to in the case of number-based and date time-based comparisons. */
    d: number;
    s?: never; l?: never;
  };

  type UserConditionStringListComparisonValue = {
    /** The string array value that the User Object attribute is compared to in the case of specific text-based, SemVer-based and string array-based comparisons. */
    l: string[];
    s?: never; d?: never;
  };

  /** Describes a condition that is based on a prerequisite flag. */
  type PrerequisiteFlagCondition = {
    /** The key of the prerequisite flag that the condition is based on. */
    f: string;
    /** The operator which defines the relation between the evaluated value of the prerequisite flag and the comparison value. */
    c: PrerequisiteFlagComparator;
    /** The value that the evaluated value of the prerequisite flag is compared to. */
    v: SettingValue;
  };

  /** Describes a condition that is based on a segment. */
  type SegmentCondition = {
    /** The zero-based index of the segment. */
    s: number;
    /** The operator which defines the expected result of the evaluation of the segment. */
    c: SegmentComparator;
  };

  /** Contains a setting value along with related data. */
  type ServedValue<TSetting extends SettingType = SettingType> = {
    /** Setting value. */
    v: SettingValue<TSetting>;
    /** Variation ID. */
    i: string;
  };

  const enum RedirectMode {
    No = 0,
    Should = 1,
    Force = 2,
  }

  /** Setting type. */
  const enum SettingType {
    /** On/off type (feature flag). */
    Boolean = 0,
    /** Text type. */
    String = 1,
    /** Whole number type. */
    Int = 2,
    /** Decimal number type. */
    Double = 3,
  }

  /** User Object attribute comparison operator used during the evaluation process. */
  const enum UserComparator {
    /** IS ONE OF (cleartext) - Checks whether the comparison attribute is equal to any of the comparison values. */
    TextIsOneOf = 0,
    /** IS NOT ONE OF (cleartext) - Checks whether the comparison attribute is not equal to any of the comparison values. */
    TextIsNotOneOf = 1,
    /** CONTAINS ANY OF (cleartext) - Checks whether the comparison attribute contains any comparison values as a substring. */
    TextContainsAnyOf = 2,
    /** NOT CONTAINS ANY OF (cleartext) - Checks whether the comparison attribute does not contain any comparison values as a substring. */
    TextNotContainsAnyOf = 3,
    /** IS ONE OF (semver) - Checks whether the comparison attribute interpreted as a semantic version is equal to any of the comparison values. */
    SemVerIsOneOf = 4,
    /** IS NOT ONE OF (semver) - Checks whether the comparison attribute interpreted as a semantic version is not equal to any of the comparison values. */
    SemVerIsNotOneOf = 5,
    /** &lt; (semver) - Checks whether the comparison attribute interpreted as a semantic version is less than the comparison value. */
    SemVerLess = 6,
    /** &lt;= (semver) - Checks whether the comparison attribute interpreted as a semantic version is less than or equal to the comparison value. */
    SemVerLessOrEquals = 7,
    /** &gt; (semver) - Checks whether the comparison attribute interpreted as a semantic version is greater than the comparison value. */
    SemVerGreater = 8,
    /** &gt;= (semver) - Checks whether the comparison attribute interpreted as a semantic version is greater than or equal to the comparison value. */
    SemVerGreaterOrEquals = 9,
    /** = (number) - Checks whether the comparison attribute interpreted as a decimal number is equal to the comparison value. */
    NumberEquals = 10,
    /** != (number) - Checks whether the comparison attribute interpreted as a decimal number is not equal to the comparison value. */
    NumberNotEquals = 11,
    /** &lt; (number) - Checks whether the comparison attribute interpreted as a decimal number is less than the comparison value. */
    NumberLess = 12,
    /** &lt;= (number) - Checks whether the comparison attribute interpreted as a decimal number is less than or equal to the comparison value. */
    NumberLessOrEquals = 13,
    /** &gt; (number) - Checks whether the comparison attribute interpreted as a decimal number is greater than the comparison value. */
    NumberGreater = 14,
    /** &gt;= (number) - Checks whether the comparison attribute interpreted as a decimal number is greater than or equal to the comparison value. */
    NumberGreaterOrEquals = 15,
    /** IS ONE OF (hashed) - Checks whether the comparison attribute is equal to any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextIsOneOf = 16,
    /** IS NOT ONE OF (hashed) - Checks whether the comparison attribute is not equal to any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextIsNotOneOf = 17,
    /** BEFORE (UTC datetime) - Checks whether the comparison attribute interpreted as the seconds elapsed since {@link https://en.wikipedia.org/wiki/Unix_time | Unix Epoch} is less than the comparison value. */
    DateTimeBefore = 18,
    /** AFTER (UTC datetime) - Checks whether the comparison attribute interpreted as the seconds elapsed since {@link https://en.wikipedia.org/wiki/Unix_time | Unix Epoch} is greater than the comparison value. */
    DateTimeAfter = 19,
    /** EQUALS (hashed) - Checks whether the comparison attribute is equal to the comparison value (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextEquals = 20,
    /** NOT EQUALS (hashed) - Checks whether the comparison attribute is not equal to the comparison value (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextNotEquals = 21,
    /** STARTS WITH ANY OF (hashed) - Checks whether the comparison attribute starts with any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextStartsWithAnyOf = 22,
    /** NOT STARTS WITH ANY OF (hashed) - Checks whether the comparison attribute does not start with any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextNotStartsWithAnyOf = 23,
    /** ENDS WITH ANY OF (hashed) - Checks whether the comparison attribute ends with any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextEndsWithAnyOf = 24,
    /** NOT ENDS WITH ANY OF (hashed) - Checks whether the comparison attribute does not end with any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveTextNotEndsWithAnyOf = 25,
    /** ARRAY CONTAINS ANY OF (hashed) - Checks whether the comparison attribute interpreted as a comma-separated list contains any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveArrayContainsAnyOf = 26,
    /** ARRAY NOT CONTAINS ANY OF (hashed) - Checks whether the comparison attribute interpreted as a comma-separated list does not contain any of the comparison values (where the comparison is performed using the salted SHA256 hashes of the values). */
    SensitiveArrayNotContainsAnyOf = 27,
    /** EQUALS (cleartext) - Checks whether the comparison attribute is equal to the comparison value. */
    TextEquals = 28,
    /** NOT EQUALS (cleartext) - Checks whether the comparison attribute is not equal to the comparison value. */
    TextNotEquals = 29,
    /** STARTS WITH ANY OF (cleartext) - Checks whether the comparison attribute starts with any of the comparison values. */
    TextStartsWithAnyOf = 30,
    /** NOT STARTS WITH ANY OF (cleartext) - Checks whether the comparison attribute does not start with any of the comparison values. */
    TextNotStartsWithAnyOf = 31,
    /** ENDS WITH ANY OF (cleartext) - Checks whether the comparison attribute ends with any of the comparison values. */
    TextEndsWithAnyOf = 32,
    /** NOT ENDS WITH ANY OF (cleartext) - Checks whether the comparison attribute does not end with any of the comparison values. */
    TextNotEndsWithAnyOf = 33,
    /** ARRAY CONTAINS ANY OF (cleartext) - Checks whether the comparison attribute interpreted as a comma-separated list contains any of the comparison values. */
    ArrayContainsAnyOf = 34,
    /** ARRAY NOT CONTAINS ANY OF (cleartext) - Checks whether the comparison attribute interpreted as a comma-separated list does not contain any of the comparison values. */
    ArrayNotContainsAnyOf = 35,
  }

  /** Prerequisite flag comparison operator used during the evaluation process. */
  const enum PrerequisiteFlagComparator {
    /** EQUALS - Checks whether the evaluated value of the specified prerequisite flag is equal to the comparison value. */
    Equals = 0,
    /** NOT EQUALS - Checks whether the evaluated value of the specified prerequisite flag is not equal to the comparison value. */
    NotEquals = 1,
  }

  /** Segment comparison operator used during the evaluation process. */
  const enum SegmentComparator {
    /** IS IN SEGMENT - Checks whether the conditions of the specified segment are evaluated to true. */
    IsIn = 0,
    /** IS NOT IN SEGMENT - Checks whether the conditions of the specified segment are evaluated to false. */
    IsNotIn = 1,
  }
}
